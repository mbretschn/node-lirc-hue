<template>
  <v-container class="remotes">
    <v-row>
      <v-col cols="6" class="switches">
        <v-switch
          v-model="active"
          :disabled="true"
          label="Active"></v-switch>
        <v-switch
          v-model="mute"
          :disabled="!active"
          label="Mute"></v-switch>
        <v-switch
          v-model="multi"
          :disabled="!active"
          label="Multiroom"></v-switch>
      </v-col>
      <v-col cols="6" class="slider">
        <v-slider
          v-model="yamaha"
          :step="1"
          :min="0"
          :max="30"
          :disabled="disabledYamaha"
          :vertical="true"
          @start="startYamaha"
          @end="endYamaha"
          append-icon="volume_up"
          prepend-icon="volume_down"
        ></v-slider>
        <label class="v-label theme--light">Volume</label>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "RemoveControls",
  computed: {
    active: {
      get () { return this.$store.state.active },
      set (value) { this.$socket.emit('active', !!value) }
    },
    mute: {
      get () { return this.$store.state.mute },
      set (value) { this.$socket.emit('mute', !!value) }
    },
    multi: {
      get () { return this.$store.state.multi },
      set (value) { this.$socket.emit('multi', !!value)}
    },
    yamaha: {
      get () { return this.$store.state.yamaha },
      set (value) { this.$store.state.yamaha !== value && this.$socket.emit('yamaha', value) }
    },
    disabledYamaha: function () { return !(this.$store.state.active && !this.$store.state.mute) },
  },
  methods: {
    startYamaha: function () { this.$store.state.interruptYamaha = true },
    endYamaha: function () { this.$store.state.interruptYamaha = false }
  }
};
</script>

<style lang="scss">
.switches {
  padding-left: 45px !important;
}
.v-input--switch {
  height: calc(100% / 3);
  margin-top: 0 !important;
  padding-top: 0 !important;
  position: relative;
  .v-input__control {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
  .v-input__slot {
    margin-bottom: 0px;
  }
  .v-messages {
    display: none;
  }
}
.slider {
  text-align: center;
}
.v-input__slider--vertical {
  .v-input__prepend-outer,
  .v-input__append-outer {
    width: 100%;
    margin-right: 0px !important;
    margin-left: 0px !important;
  }
}
</style>
