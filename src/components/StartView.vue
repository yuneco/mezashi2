<template>
  <div class="start-view-root">
    <div class="info">
      ネコメザシアタックは画面をタップしてネコにメザシをあたえるだけのゆるかわゲームです
    </div>
    <div class="btns">
      <button class="btn harf" @click="start">START</button>
    </div>
    <div class="howto">
      <img src="img/howtoplay.png" />
    </div>
  </div>
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api'
import playSound from '../lib/playSound'

export default createComponent({
  props: {
    score: { type: Number, default: 0 }
  },
  setup (props, ctx) {
    const start = () => {
      playSound('btn')
      ctx.emit('start')
    }
    return {
      start
    }
  }
})
</script>

<style lang="scss" scoped>
.info {
  font-size: 13px;
  letter-spacing: 0.1em;
}
.btn {
   text-align: center;
  height: 60px;
  line-height: 60px;
  font-size: 20px;
  box-sizing: border-box;
  margin-left: 5px;
  margin-right: 5px;
  padding: 5px 10px;
  font-weight: bold;
  user-select: none;
  outline: none;
  color: #316285;
  background-color:transparent;
  transition: background-color 300ms;
  border: none;
  border-bottom: 2px solid #316285;
  &:active {
    background-color: #316285;
    transition: background-color 0ms;
    color:rgb(217, 235, 232);
  }
  &.harf {
    display: inline-block;
    width: 40%;
  }
  &.full {
    display: block;
    width: 100%;
    .caption {
      font-size: 16px;
      display: block;
    }
    .note {
      font-size: 11px;
      display: block;
    }
  }
}
.howto {
  padding-top: 20px;
  text-align: center;
  img {
    max-width: 80%;
    border: 1px solid #316285;
  }
}
</style>
