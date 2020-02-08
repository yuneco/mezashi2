<template>
  <ECont class="planet-root"
    :x="planetPos.x - planetSize.w / 2"
    :y="planetPos.y - planetSize.h / 2"
    :r="planetPos.r"
    :w="planetSize.w" :h="planetSize.h"
    :a="a"
    :dur="2000"
    :style="{
      borderRadius: `${round}px`,
      backgroundColor: color
    }"
  >
  </ECont>
</template>

<script lang="ts">
import { createComponent, reactive, onMounted, computed } from '@vue/composition-api'
import Pos from '../lib/Pos'
import Size from '../lib/Size'

export default createComponent({
  props: {
    color: { type: String, default: 'gold' },
    a: { type: Number, default: 1 },
    round: { type: Number, default: 30 },
    pos: { type: Object, default: () => new Pos(0, 0, 0) },
    size: { type: Object, default: () => new Size(200, 200) }
  },
  setup (props, ctx) {
    const data = reactive({
      isInited: false
    })
    const planetPos = computed<Pos>(() => data.isInited ? props.pos as Pos : new Pos(props.pos.x, props.pos.y, -90))
    const planetSize = computed<Size>(() => data.isInited ? props.size as Size : new Size(0, 0))

    onMounted(() => {
      ctx.root.$nextTick(() => {
        data.isInited = true
      })
    })
    return {
      data,
      planetPos,
      planetSize
    }
  }
})
</script>

<style lang="scss" scoped>
.planet-root {
  box-sizing: border-box;
}
</style>
