<template>
  <ECont class="planet-root"
    :x="planetPos.x - planetSize.w / 2"
    :y="planetPos.y - planetSize.h / 2"
    :r="planetPos.r"
    :w="planetSize.w" :h="planetSize.h"
    :a="a"
    :dur="2000"
  >
    <Neko ref="nekos" v-for="(neko, index) in nekosData.nekos" :key="neko.id"
      :pos="nekoPos.pos[index]"
      :s="charaScale"
      :groundY="round"
      :action="neko.action"
      @drop="nekoDroped(neko, index)"
    />
    <div class="glound"
      :style="{
        borderRadius: `${round}px`,
        backgroundColor: color
      }" />
  </ECont>
</template>

<script lang="ts">
import { createComponent, reactive, onMounted, computed, ref, onBeforeUnmount } from '@vue/composition-api'
import Neko from './Neko.vue'
import Pos from '../lib/Pos'
import Size from '../lib/Size'
import Angle8 from '../lib/Angle8'
import wait from '../lib/wait'
import MathUtil from '../lib/MathUtil'

interface NekoState {
  id: string;
  startX: number;
  stayTime: number | null;
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
    maxCat: { type: Number, default: 0 },
    catSpeed: { type: Number, default: 1.0 },
    charaScale: { type: Number, default: 1 },
    catInterval: { type: Number, default: 1500 }
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
        return nekos.map(neko => {
          const time = neko.stayTime ?? nekosData.updateTime
          const sec = (time - neko.started) / 1000
          const x = sec * neko.speed + neko.startX
          return Angle8.at(x, props.size.w - props.round * 2, props.size.h - props.round * 2).add(new Pos(props.round, props.round, 0))
        })
      })
    })

    const addNeko = (speed = 1.0) => {
      nekosData.updateTime = Date.now()
      nekosData.nekos.push({
        id: `neko-${Math.random()}`,
        startX: 1000 * 8 + MathUtil.between(6, 7),
        stayTime: null,
        speed: -(0.5 + Math.random() * 0.5) * speed,
        started: Date.now(),
        action: Math.random() > 0.5 ? 'walk' : 'jump'
      })
    }

    const nekoDroped = (neko: NekoState) => {
      ctx.emit('nekoDroped')
      neko.stayTime = Date.now()
    }

    const data = reactive({
      isInited: false
    })
    const planetPos = computed<Pos>(() => data.isInited ? props.pos as Pos : new Pos(props.pos.x, props.pos.y, -90))
    const planetSize = computed<Size>(() => data.isInited ? props.size as Size : new Size(0, 0))

    const nekoComs = computed<Vue[]>(() => {
      const nekosVal = nekos.value
      if (!nekosVal) { return [] }
      return props.hasCat ? (nekosVal.filter(n => n.isAlive) as unknown as Vue[]) : []
    })

    onMounted(async () => {
      await wait(100)
      // 地面が現れるアニメーション開始
      data.isInited = true
      // アニメーションが終わるあたりまで待つ
      await wait(2500)
      const bookAddNeko = (ms: number) => {
        window.setTimeout(() => {
          if (!isUnmounted && nekosData.nekos.length < props.maxCat) {
            addNeko(props.catSpeed)
            bookAddNeko(ms)
          }
        }, ms)
      }
      bookAddNeko(props.catInterval)
      const catWalkTimer = window.setInterval(() => {
        if (isUnmounted) {
          window.clearInterval(catWalkTimer)
          return
        }
        const nekoComps = nekos.value
        if (!nekoComps) { return }
        nekosData.updateTime = Date.now()
        nekoComps.forEach(nekoComp => {
          nekoComp.actions.default()
        })
      }, 700)
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
      nekoDroped,
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
  .glound {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
