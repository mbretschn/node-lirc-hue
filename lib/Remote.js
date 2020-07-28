const config = require('config')
const fs = require('fs')
const moment = require('moment')
const v3 = require('node-hue-api').v3
const lirc_node = require('lirc_node')

module.exports = class Remote {
    constructor () {
        this.subscriber = []
        this.init()
    }
    async readState() {
        return new Promise(resolve => {
            let data = fs.readFileSync(__dirname + '/../data/state.json')
            this.state = JSON.parse(data)
            resolve()
        })
    }
    async saveState() {
        return new Promise(resolve => {
            let data = JSON.stringify(this.state, '', 2)
            fs.writeFileSync(__dirname + '/../data/state.json', data)
            resolve()
        })
    }

    async sendCommand(receiver, command) {
        return new Promise(resolve => {
           lirc_node.irsend.send_once(receiver, command, function() {
              console.log(moment().format(), `Send ${command} to ${receiver}`)
              resolve()
           })
        })
     }
    async isActive() {
        return new Promise(resolve => {
            v3.discovery.nupnpSearch()
                .then(searchResults => {
                    const host = searchResults[0].ipaddress;
                    return v3.api.createLocal(host).connect(config.User);
                })
                .then(api => {
                    return api.lights.getLightState(10);
                })
                .then(state => {
                    resolve(state.on);
                })
        })
    }

    async pollState () {
        setTimeout(async () => {
            const before = this.state.active
            this.state.active = await this.isActive()

            if (this.state.active !== before) {
                console.log(moment().format(), 'State changed', this.state.active)
                if (this.state.active) {
                   await this.sendCommand('yamaha', 'KEY_POWER')
                   await this.sendCommand('sony', 'KEY_POWER')
                } else {
                   await this.sendCommand('sony', 'KEY_POWER')
                   await this.sendCommand('yamaha', 'KEY_POWER')
                   this.state.mute = false
                   this.state.multi = false
                   this.broadcast('mute', true)
                   this.broadcast('multi', true)
               }
               await this.broadcast('active')
           }

           await this.pollState()
        }, 1000)
    }

    async init() {
        lirc_node.init()
        await this.readState()
        this.state.active = await this.isActive()
        await this.pollState()
    }

    subscribe(socket) {
        for (const event of Object.keys(this.state)) {
            socket.on(event, this[event].bind(this))
            socket.emit(event, this.state[event])
        }
        this.subscriber.push(socket)
    }
    unsubscribe(socket) {
        const idx = this.subscriber.findIndex(subscriber => subscriber.id === socket.id)
        if (idx > -1) {
            for (const event of Object.keys(this.state)) {
                this.subscriber[idx].removeAllListeners(event)
            }
            this.subscriber.splice(idx, 1)
        }
    }

    async broadcast(event, refusesave) {
        for (const subscriber of this.subscriber) {
            subscriber.emit(event, this.state[event])
        }
        if (!refusesave) {
            await this.saveState()
        }
    }
    async active(data) {
        this.state.active = data
        await this.broadcast('active')
    }
    async mute(data) {
        this.state.mute = data
        await this.sendCommand('yamaha', 'KEY_MUTE')
        await this.broadcast('mute')
    }
    async multi(data) {
        this.state.multi = data
        await this.sendCommand('yamaha', 'KEY_PROGRAM')
        await this.broadcast('multi')
    }
    async yamaha(data) {
        if (this.state.yamaha === data) return
        const before = this.state.yamaha
        this.state.yamaha = data
        if (before < data) {
            this.sendCommand('yamaha', 'KEY_VOLUMEUP')
        } else {
            this.sendCommand('yamaha', 'KEY_VOLUMEDOWN')
        }
        await this.broadcast('yamaha')
    }
}