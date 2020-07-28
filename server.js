const config = require('config')
const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const proxy = require('express-http-proxy');
const Remote = require('./lib/Remote')

var remote = new Remote()

io.on('connection', (socket) => {
    remote.subscribe(socket)

    socket.on('disconnect', () => {
        remote.unsubscribe(socket)
    })
})

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'))
} else {
    app.use('/', proxy('http://localhost:8080/'))
}

http.listen(config.get('Port'), () => {
    console.log('listening on *:' + config.get('Port'))
})