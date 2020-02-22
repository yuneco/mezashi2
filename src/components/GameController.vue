<template>
  <div class="game-controller-root">
    <button class="btn esc" @click="onEsc">
      <span class="label">ESC</span>
      <span class="content">{{ escBulletsStr }}</span>
    </button>
    <button class="btn jump" @click="onJump">JUMP</button>
  </div>
</template>

<script lang="ts">
import { createComponent, computed } from '@vue/composition-api'
export default createComponent({
  props: {
    maxEscCount: { type: Number, default: 2 },
    escCount: { type: Number, default: 2 }
  },
  setup (props, ctx) {
    const onEsc = () => {
      if (!props.escCount) { return }
      ctx.emit('esc')
    }
    const onJump = () => ctx.emit('jump')

    const escBulletsStr = computed<string>(() => {
      const left = props.escCount
      const used = Math.max(0, props.maxEscCount - props.escCount)
      return Array(left + 1).join('●') + Array(used + 1).join('○')
    })

    return {
      onEsc, onJump, escBulletsStr
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
    background-color: rgb(217, 235, 232);
    .btn {
      text-align: center;
      height: 60px;
      line-height: 60px;
      font-size: 20px;
      font-weight: bold;
      user-select: none;
      outline: none;
      color: #316285;
      background-color: rgb(217, 235, 232);
      transition: background-color 300ms;
      border: none;
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
      border-right: 2px solid #fff;
      .label {
        display: block;
        font-size: 16px;
        line-height: 20px;
      }
      .content {
        display: block;
        font-size: 10px;
        line-height: 20px;
        letter-spacing: 0.3em;
      }
    }
    .jump {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 45%;
      border-left: 2px solid #fff;
    }
  }
</style>
