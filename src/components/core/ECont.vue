<template>
  <div class="elem-container"
    :class="{
      debug: debug
    }"
    :style="{
      width: `${w}px`,
      height: `${h}px`,
      backgroundImage: img ? `url(${img})` : 'none',
      opacity: a,
      transformOrigin: `${ox}% ${oy}%`,
      transform: `translate3d(${x}px, ${y}px ,${z}px) scale(${scaleXY}) rotate(${r}deg)`,
      transition: (disableAnimation && !dur) ? 'none' : `
        transform ${dur}ms ${easing},
        width ${dur}ms ${easing},
        height ${dur}ms ${easing},
        transform-origin ${dur}ms ${easing},
        opacity ${dur}ms ${easing}`,
      willChange: 'transform'
    }"
    @click="clicked"
    >
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
  div.elem-container {
    position: absolute;
    left: 0;
    top: 0;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    box-sizing: border-box;
  }
  .debug {
    border: 1px dotted red;
    .debug-origin {
      position: absolute;
      width: 3px;
      height: 3px;
      left: 0;
      top: 0;
      background-color: red;
    }
    .debug-name {
      position: absolute;
      top: -10pt;
      left: 0;
      font-size: 8pt;
      color: red;
    }
  }
</style>

<script lang="ts">
import { createComponent, computed } from '@vue/composition-api'
export default createComponent({
  props: {
    debug: { type: [Boolean, String], default: false },
    name: { type: String, default: '' },
    img: { type: String },
    ox: { type: [Number, String], default: 50 },
    oy: { type: [Number, String], default: 50 },
    x: { type: [Number, String], default: 0 },
    y: { type: [Number, String], default: 0 },
    w: { type: [Number, String], default: 0 },
    h: { type: [Number, String], default: 0 },
    z: { type: [Number, String], default: 0 },
    r: { type: [Number, String], default: 0 },
    s: { type: [Number, String, Array], default: 1 },
    a: { type: [Number, String], default: 1 },
    dur: { type: [Number, String], default: 0 },
    easing: { type: String, default: 'ease' },
    disableAnimation: { type: Boolean, default: false }
  },
  setup (props, ctx) {
    const scaleXY = computed<string>(() => Array.isArray(props.s) ? `${props.s[0]}, ${props.s[1]}` : props.s.toString())
    const clicked = (ev: Event) => {
      ctx.emit('click', ev)
    }
    return {
      scaleXY,
      clicked
    }
  }
})
</script>
