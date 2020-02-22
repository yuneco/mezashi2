<template>
  <div id="app" :style="{height: `${height}px`}">
    <GameStage v-if="appState.isPlaying" @end="end" />
    <TopScreen v-if="!appState.isPlaying || appState.topScreenAnimating" :score="appState.lastScore" @start="start" style="z-index: 1;" />
  </div>
</template>

<script lang="ts">
import { createComponent, ref, reactive } from '@vue/composition-api'
import GameStage from './components/GameStage.vue'
import TopScreen from './components/TopScreen.vue'
import wait from './lib/wait'

export default createComponent({
  name: 'App',
  components: {
    GameStage,
    TopScreen
  },
  setup () {
    const height = ref<number>(window.innerHeight)
    const appState = reactive({
      isPlaying: false,
      topScreenAnimating: false,
      lastScore: -1
    })
    const start = async () => {
      appState.lastScore = -1
      appState.isPlaying = true
      appState.topScreenAnimating = true
      await wait(1500)
      appState.topScreenAnimating = false
    }
    const end = async (score: number) => {
      appState.lastScore = score
      appState.topScreenAnimating = true
      await wait(1500)
      appState.topScreenAnimating = false
      appState.isPlaying = false
    }
    return {
      appState,
      height,
      start,
      end
    }
  }
})
</script>

<style lang="scss">
body {
  margin: 0;
  height: 100%;
  touch-action: manipulation;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
}
</style>
