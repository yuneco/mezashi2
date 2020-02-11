<template>
  <div id="app">
    <GameStage></GameStage>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import GameStage from './components/GameStage.vue'

export default Vue.extend({
  name: 'App',
  components: {
    GameStage
  }
})
</script>

<style lang="scss">
body {
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
