<template>
  <div class="game-controller-root">
    <button class="btn esc" @click="onEsc">ESC</button>
    <button class="btn jump" @click="onJump">JUMP</button>
  </div>
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api'
export default createComponent({
  setup (props, ctx) {
    const onEsc = () => ctx.emit('esc')
    const onJump = () => ctx.emit('jump')
    return {
      onEsc, onJump
    }
  }
})
</script>

<style lang="scss" scoped>
  .game-controller-root {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 60px;
    padding: 10px;
    box-sizing: border-box;
    .btn {
      background-color: rgb(191, 221, 221);
      border: 2px solid rgb(97, 136, 148);
      text-align: center;
      height: 60px;
      line-height: 60px;
      font-size: 1.2em;
      font-weight: bold;
      user-select: none;
      outline: none;
      transition: background-color 300ms;
      &:active {
        background-color: rgb(97, 136, 148);
        transition: background-color 0ms;
      }
    }
    .esc {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 70px;
      border-radius: 35px;
    }
    .jump {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 45%;
      border-radius: 5px;
    }
  }
</style>
