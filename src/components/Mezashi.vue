<template>
  <ECont class="mexashi-root"
    :x="lane.pos.x" :y="lane.pos.y" :r="lane.pos.r" :s="lane.pos.s" :w="lane.size.w" :h="lane.size.h" :ox="0" :oy="50"
  >
    <ECont ref="hitBody" img="/img/mezashi.svg"
      :x="bodyPos.x" :y="bodyPos.y" :w="116 * 0.7" :h="20 * 0.7" :s="0.7" :dur="dur" easing="linear"
    />
  </ECont>
</template>

<script lang="ts">
import { createComponent, reactive, computed, onMounted, ref } from '@vue/composition-api'
import Pos from '../lib/Pos'
import Size from '../lib/Size'
import Tween from '../lib/Tween'
import useCollision from '../lib/UseCollision'

const LANE_LEN = window.innerHeight
interface Props {
  pos: Pos;
  dur: number;
}

export default createComponent({
  props: {
    pos: { type: Object, default: () => new Pos() },
    dur: { type: Number, default: 2000 }
  },
  setup (props: Props, ctx) {
    const lane = reactive({
      size: new Size(LANE_LEN, 20),
      pos: computed<Pos>(() => props.pos)
    })
    const bodyPos = reactive({
      x: 0,
      y: 0
    })
    const fire = async () => {
      await Tween.to(bodyPos, { x: 0 }, 0)
      await Tween.to(bodyPos, { x: LANE_LEN }, props.dur)
      ctx.emit('fin')
    }
    onMounted(() => {
      ctx.root.$nextTick(fire)
    })

    const hitBody = ref<Vue>()
    const { collisionDef, collisionBox, initCollisionDef } = useCollision()
    onMounted(() => {
      const hitBodyComp = hitBody.value
      if (!hitBodyComp) { return }
      collisionDef.safeMargin = 0
      const onhit = (target: Vue, name: string, index: number) => { console.log('mezashi hit with: ', name, target, index) }
      initCollisionDef(hitBodyComp, 'mezashi', onhit)
    })

    return {
      lane, bodyPos, hitBody, collisionDef, collisionBox
    }
  }
})
</script>

<style lang="scss" scoped>
.mexashi-root {
  // border: 1px solid red;
}
</style>
