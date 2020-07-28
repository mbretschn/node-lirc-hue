<template>
  <div class="home">
    <RemoteControls />
  </div>
</template>

<script>
// @ is an alias to /src
import RemoteControls from '@/components/RemoteControls.vue'

export default {
  name: 'Home',
  components: {
    RemoteControls
  }
}
</script>
