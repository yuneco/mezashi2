<template>
  <div class="top-screen-root">
    <transition-group name="slide" appear>
      <WaveShape class="wave wave1" :key="1" v-show="screen.isShow" :width="screen.width + 200" :height="screen.height" :count="4" color="#77abba" />
      <WaveShape class="wave wave2" :key="2" v-show="screen.isShow" :width="screen.width + 200" :height="screen.height" :count="11" color="#90cad1" />
      <WaveShape class="wave wave3" :key="3" v-show="screen.isShow" :width="screen.width + 200" :height="screen.height" :count="7" color="rgb(217, 235, 232)" />
      <div class="main" v-show="screen.isShow" :key="4">
        <h1>Neko Mezashi Attack 2020<span class="sub">v2020.2.29.1</span></h1>
        <div class="main-view">
          <StartView v-if="isStartView" @start="start" />
          <ResultView v-if="isResultView" :score="score" @top="screen.isResultClosed = true" @retry="start" />
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script lang="ts">
import { createComponent, reactive, computed } from '@vue/composition-api'
import WaveShape from './graphics/WaveShape.vue'
import StartView from './StartView.vue'
import ResultView from './ResultView.vue'

export default createComponent({
  components: {
    WaveShape,
    StartView,
    ResultView
  },
  props: {
    score: { type: Number, default: -1 }
  },
  setup (props, ctx) {
    const screen = reactive({
      isShow: true,
      isResultClosed: false,
      width: window.innerWidth,
      height: window.innerHeight
    })
    const start = () => {
      screen.isShow = false
      ctx.emit('start')
    }
    const isResultView = computed(() => {
      return !screen.isResultClosed && props.score >= 0
    })
    const isStartView = computed(() => {
      return !isResultView.value
    })
    return {
      start,
      screen,
      isResultView,
      isStartView
    }
  }
})
</script>

<style lang="scss" scoped>
.top-screen-root {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  // background-color: rgb(217, 235, 232);
  color: #316285;
  text-align: center;
}
h1 {
  margin: 0;
  padding: 20px 0 0 0;
  color: #fff;
  text-align: center;
  font-size: 16px;
  letter-spacing: 0.2em;
  .sub {
    font-size: 9px;
    display: block;
  }
}
.btn {
  text-align: center;
  height: 60px;
  line-height: 60px;
  font-size: 1.2em;
  padding: 10px;
  font-weight: bold;
  user-select: none;
  outline: none;
  color: #316285;
  background-color: rgb(217, 235, 232);
  transition: background-color 300ms;
  border: none;
  border-radius: 30px;
  &:active {
    background-color: rgb(97, 136, 148);
    transition: background-color 0ms;
    color:rgb(217, 235, 232);
  }
  &.start {
    margin-top: 200px;
  }
}
.wave {
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  transition-delay: 0ms;
  transform: translateY(0px);
  animation: 3.5s ease-in-out 0s infinite alternate shake;
}
.wave1 {
  top: -20px;
  animation-delay: 0ms;
  &.slide-enter-active {
    transition-delay: 0ms;
  }
  &.slide-leave-active {
    transition-delay: 500ms;
  }
}
.wave2 {
  top: 90px;
  animation-delay: 600ms;
  &.slide-enter-active {
    transition-delay: 200ms;
  }
  &.slide-leave-active {
    transition-delay: 200ms;
  }
}
.wave3, .main {
  top: 120px;
  animation-delay: 2200ms;
  &.slide-enter-active {
    transition-delay: 500ms;
  }
  &.slide-leave-active {
    transition-delay: 0ms;
  }
}
.main {
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  transform: translateY(0px);
  .main-view {
    padding: 100px 30px 30px 30px;
  }
}
.slide-enter-active, .slide-leave-active {
  transition-property: transform;
  transition-duration: 1.5s;
}
.slide-enter, .slide-leave-to {
  transform: translateY(100%);
}

@keyframes shake {
  0% { left: 0 }
  100% { left: -200px }
}
</style>
