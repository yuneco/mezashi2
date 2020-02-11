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
    <Neko ref="neko" :pos="nekoPos.pos" :groundY="round" />
  </ECont>
</template>

<script lang="ts">
import { createComponent, reactive, onMounted, computed, ref } from '@vue/composition-api'
import Neko from './Neko.vue'
import Pos from '../lib/Pos'
import Size from '../lib/Size'
import Angle8 from '../lib/Angle8'

export default createComponent({
  components: {
    Neko
  },
  props: {
    color: { type: String, default: 'gold' },
    a: { type: Number, default: 1 },
    round: { type: Number, default: 30 },
    pos: { type: Object, default: () => new Pos(0, 0, 0) },
    size: { type: Object, default: () => new Size(200, 200) }
  },
  setup (props, ctx) {
    const neko = ref<InstanceType<typeof Neko>>(null)
    const data = reactive({
      isInited: false
    })
    const planetPos = computed<Pos>(() => data.isInited ? props.pos as Pos : new Pos(props.pos.x, props.pos.y, -90))
    const planetSize = computed<Size>(() => data.isInited ? props.size as Size : new Size(0, 0))

    const debug = reactive({
      nekoPosTime: 7,
      catWalk: async () => {
        const nekoComp = neko.value
        if (!nekoComp) { return }
        for (;;) {
          await nekoComp.actions.walk()
          const isOnCorner = Math.floor(debug.nekoPosTime) % 2 === 1
          debug.nekoPosTime -= isOnCorner ? 0.3 : 0.1
        }
      }
    })

    const nekoPos = reactive({
      pos: computed<Pos>(() => Angle8.at(debug.nekoPosTime, props.size.w - props.round * 2, props.size.h - props.round * 2).add(new Pos(props.round, props.round, 0)))
    })

    const nekoComs = computed(() => {
      return [neko.value as unknown as Vue]
    })

    onMounted(() => {
      ctx.root.$nextTick(() => {
        data.isInited = true
      })
      debug.catWalk()
    })

    return {
      neko,
      nekoPos,
      nekoComs,
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
