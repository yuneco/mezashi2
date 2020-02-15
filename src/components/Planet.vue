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
    <Neko ref="nekos" v-for="(neko, index) in nekosData.nekos" :key="neko.id" :pos="nekoPos.pos[index]" :groundY="round" :action="neko.action" />
  </ECont>
</template>

<script lang="ts">
import { createComponent, reactive, onMounted, computed, ref, onBeforeUnmount } from '@vue/composition-api'
import Neko from './Neko.vue'
import Pos from '../lib/Pos'
import Size from '../lib/Size'
import Angle8 from '../lib/Angle8'

interface NekoState {
  id: string;
  startX: number;
  speed: number;
  started: number;
  action: 'walk' | 'jump';
}

export default createComponent({
  components: {
    Neko
  },
  props: {
    color: { type: String, default: 'gold' },
    a: { type: Number, default: 1 },
    round: { type: Number, default: 30 },
    pos: { type: Object, default: () => new Pos(0, 0, 0) },
    size: { type: Object, default: () => new Size(200, 200) },
    hasCat: { type: Boolean, default: true },
    maxCat: { type: Number, default: 0 }
  },
  setup (props, ctx) {
    let isUnmounted = false
    const nekos = ref<InstanceType<typeof Neko>[]>(null)
    const nekosData = reactive<{nekos: NekoState[]; updateTime: number}>({
      nekos: [],
      updateTime: Date.now()
    })
    const nekoPos = reactive({
      pos: computed<Pos[]>(() => {
        const nekos = nekosData.nekos
        const time = nekosData.updateTime
        return nekos.map(neko => {
          const sec = (time - neko.started) / 1000
          const x = sec * neko.speed + neko.startX
          return Angle8.at(x, props.size.w - props.round * 2, props.size.h - props.round * 2).add(new Pos(props.round, props.round, 0))
        })
      })
    })

    const addNeko = () => {
      nekosData.nekos.push({
        id: `neko-${Math.random()}`,
        startX: 806,
        speed: -(0.5 + Math.random() * 0.5),
        started: Date.now(),
        action: Math.random() > 0.5 ? 'walk' : 'jump'
      })
    }

    const data = reactive({
      isInited: false
    })
    const planetPos = computed<Pos>(() => data.isInited ? props.pos as Pos : new Pos(props.pos.x, props.pos.y, -90))
    const planetSize = computed<Size>(() => data.isInited ? props.size as Size : new Size(0, 0))

    const debug = reactive({
      catWalk: async () => {
        for (;;) {
          if (isUnmounted) {
            // console.log('Finish catwalk: unmounted')
            break
          }
          const nekoComps = nekos.value
          if (!nekoComps) {
            await new Promise<void>(resolve => setTimeout(resolve, 500))
            // console.log('No cats at this time')
            continue
          }
          nekosData.updateTime = Date.now()
          const promises: Promise<void>[] = nekoComps.map(nekoComp => nekoComp.actions.default())
          await Promise.all(promises)
        }
      }
    })

    const nekoComs = computed(() => {
      return props.hasCat ? (nekos.value as unknown as Vue[]) : []
    })

    onMounted(() => {
      ctx.root.$nextTick(() => {
        data.isInited = true
      })
      const catAddTimer = window.setInterval(() => {
        if (isUnmounted) {
          window.clearInterval(catAddTimer)
          return
        }
        if (nekosData.nekos.length < props.maxCat) {
          addNeko()
        }
      }, 1500)
      debug.catWalk()
    })
    onBeforeUnmount(() => {
      isUnmounted = true
    })

    return {
      nekos, // template ref
      nekosData, // base data
      nekoPos, // computed
      nekoComs,
      addNeko,
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
