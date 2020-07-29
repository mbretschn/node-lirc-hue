<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        ManCave Remote Control
      </div>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-main>
      <RemoteControls/>
    </v-main>
  </v-app>
</template>

<script>
import RemoteControls from './components/RemoteControls';

export default {
  name: 'App',
  components: {
    RemoteControls,
  },
  data: () => ({
    //
  }),
};

document.body.addEventListener('touchmove', function (e) { e.preventDefault(); });
</script>

<style lang="scss">
html, body {
  height: 100hv;
  width: 100hv;
}

body {
  overflow: hidden;
  position: fixed;
}
</style>