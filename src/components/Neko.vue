<template>
<ECont :x="pos.x" :y="pos.y" :r="pos.r" :s="s" :w="1" :h="1" :dur="600">
  <ECont class="nekochan" ref="hitBody" :x="-335 / 2" :y="-330 + localPos.y - groundY" :w="335" :h="330" :ox="50" :oy="100" :dur="localPos.dur" :easing="localPos.easing" :r="localPos.r" :s="totalScale" >
    <ECont img="/img/CatAmTora.svg" :w="77" :h="103" :x="49" :y="219" :ox="80" :oy="10" :dur="partsPos.dur" :easing="partsPos.easing" :r="partsPos.amBkR" />
    <ECont img="/img/CatLgTora.svg" :w="75" :h="109" :x="210" :y="220" :ox="80" :oy="10" :dur="partsPos.dur" :easing="partsPos.easing" :r="partsPos.lgBkR" />
    <ECont img="/img/CatTaTora.svg" :w="83" :h="136" :x="251" :y="38" :ox="10" :oy="90" :dur="partsPos.dur" :easing="partsPos.easing" :r="partsPos.taR" />
    <ECont img="/img/CatBdTora.svg" :w="220" :h="122" :x="83" :y="136" :dur="partsPos.dur" :easing="partsPos.easing" :r="0" />
    <ECont img="/img/CatAmTora.svg" :w="77" :h="103" :x="70" :y="219" :ox="80" :oy="10" :dur="partsPos.dur" :easing="partsPos.easing" :r="partsPos.amFrR" />
    <ECont img="/img/CatLgTora.svg" :w="75" :h="109" :x="190" :y="220" :ox="80" :oy="10" :dur="partsPos.dur" :easing="partsPos.easing" :r="partsPos.lgFrR" />
    <ECont img="/img/CatHdTora.svg" :w="160" :h="200" :x="0" :y="0" :ox="80" :oy="80"  :dur="partsPos.dur" :easing="partsPos.easing" :r="partsPos.hdR" />
  </ECont>
</ECont>
</template>

<script lang="ts">
import { reactive, createComponent, computed, ref, onMounted } from '@vue/composition-api'
import Tween from '../lib/Tween'
import Pos from '../lib/Pos'
import useCollision from '../lib/UseCollision'

export default createComponent({
  props: {
    pos: { type: Object, default: () => new Pos(0, 0, 0) },
    s: { type: Number, default: 1 },
    groundY: { type: Number, default: 0 },
    action: { type: String, default: 'walk' }
  },
  setup (props, ctx) {
    const hitBody = ref<Vue>()
    const isAlive = ref<boolean>(true)
    const partsPos = reactive({
      taR: 0,
      amBkR: 0,
      lgBkR: 0,
      amFrR: -40,
      lgFrR: -40,
      hdR: 0,
      dur: 300,
      easing: 'ease'
    })
    const localPos = reactive({
      r: 0,
      y: 0,
      sx: 1,
      sy: 1,
      dur: 300,
      easing: 'ease'
    })
    const totalScale = computed<number[]>(() => {
      const BASE = 0.2
      return [BASE * localPos.sx, BASE * localPos.sy]
    })
    const actions = {
      stay: async () => {
        Tween.to(localPos, { sy: 1 }, 300)
        await Tween.to(partsPos, { amFrR: -40, lgFrR: -40, amBkR: 0, lgBkR: 0, hdR: 0, taR: 0 }, 300)
      },
      walk: async () => {
        if (!isAlive.value) { return }
        Tween.to(localPos, { sy: 0.8 }, 300)
        await Tween.to(partsPos, { amFrR: 0, lgFrR: 0, amBkR: -40, lgBkR: -40, hdR: 15, taR: 40 }, 300)
        if (!isAlive.value) { return }
        Tween.to(localPos, { sy: 1.0 }, 300)
        await Tween.to(partsPos, { amFrR: -40, lgFrR: -40, amBkR: 0, lgBkR: 0, hdR: 0, taR: 0 }, 300)
      },
      jump: async () => {
        if (!isAlive.value) { return }
        Tween.to(localPos, { sy: 1.2, y: -50 }, 300, 'ease-out')
        await Tween.to(partsPos, { amFrR: -40, lgFrR: -40, amBkR: -40, lgBkR: -40, hdR: 15, taR: 40 }, 300)
        Tween.to(localPos, { sy: 1.0, y: 0 }, 300, 'ease-in')
        await Tween.to(partsPos, { amFrR: -40, lgFrR: -40, amBkR: 0, lgBkR: 0, hdR: 0, taR: 0 }, 300)
      },
      drop: async () => {
        await Tween.to(localPos, {}, 0)
        await Tween.to(localPos, { r: 180, y: -120 }, 700, 'ease-out')
        await Tween.to(localPos, { r: 360, y: 80 }, 500, 'ease-in')
        await Tween.to(localPos, { r: 0, sx: 0, sy: 0 }, 0)
      },

      default: async () => {
        if (props.action === 'walk') { return actions.walk() }
        if (props.action === 'jump') { return actions.jump() }
      }
    }

    const { collisionDef, collisionBox, initCollisionDef } = useCollision()
    onMounted(() => {
      const hitBodyComp = hitBody.value
      if (!hitBodyComp) { return }
      const onhit = (target: Vue, name: string) => {
        if (name === 'neko') { return } // 猫同士の衝突はなにもしない
        actions.drop()
        isAlive.value = false
        ctx.emit('drop')
      }
      initCollisionDef(hitBodyComp, 'neko', onhit)
    })
    return {
      isAlive,
      partsPos,
      actions,
      localPos,
      totalScale,
      hitBody,
      collisionDef,
      collisionBox
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
