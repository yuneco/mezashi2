<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="width" :height="height" :viewBox="`0 0 ${width} ${height}`" >
    <path :d="pathStr" stroke-width="0" :fill="color">
    </path>
  </svg>
</template>

<script lang="ts">
import { createComponent, computed } from '@vue/composition-api'

export default createComponent({
  props: {
    color: { type: String, default: '#316285' },
    count: { type: Number, default: 20 },
    waveHeight: { type: Number, default: 20 },
    height: { type: Number, default: 200 },
    width: { type: Number, default: 500 }
  },
  setup (props) {
    const pathStr = computed(() => {
      const ys = Array(props.count).fill(0).map((_, i) => i % 2)
      const W = props.width
      const H = props.waveHeight
      const ps = ys.map((y, x) => {
        return {
          x: (x / (props.count - 1)) * W,
          y: y * H
        }
      })
      const ctrX = W / props.count * 0.5
      const cps = ps.map((p, i) => {
        if (i === ps.length - 1) { return [] }
        const np = ps[i + 1]
        return [
          { x: p.x + ctrX, y: p.y },
          { x: np.x - ctrX, y: np.y },
          np
        ]
      }).flat().map(p => `${p.x},${p.y}`)
      return `M ${ps[0].x},${ps[0].y} C ${cps.join(' ')} L ${W},${props.height} 0,${props.height} Z`
    })
    return {
      pathStr
    }
  }
})
</script>
