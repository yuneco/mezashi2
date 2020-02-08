<template>
  <ECont class="tama-home-root"
    :x="ground.x - ground.w / 2" :y="ground.y - ground.h / 2"
    :w="ground.w" :h="ground.h"
    :r="ground.r"
    :dur="3000"
  >
    <ECont
      :x="tama.pos.x"
      :y="tama.pos.y"
      :r="tama.pos.r"
      :dur="dur"
    >
      <ECont :y="-groundRound" :dur="dur">
        <TamaSan ref="tamasanMain" />
      </ECont>
    </ECont>
  </ECont>
</template>

<script lang="ts">
import { createComponent, reactive, computed, ref } from '@vue/composition-api'
import TamaSan from './TamaSan.vue'
import Angle8 from '@/lib/Angle8.ts'
import Pos from '@/lib/Pos.ts'
import Size from '../lib/Size'

export default createComponent({
  components: {
    TamaSan
  },
  props: {
    tamaX: { type: Number, default: 100 },
    groundPos: { type: Object, default: () => new Pos() },
    groundSize: { type: Object, default: () => new Size() },
    groundRound: { type: Number, default: 30 },
    dur: { type: Number, default: 0 }
  },
  setup (props) {
    const tamasanMain = ref(null)
    const ground = reactive({
      x: computed<number>(() => props.groundPos.x),
      y: computed<number>(() => props.groundPos.y),
      w: computed<number>(() => props.groundSize.w - props.groundRound * 2),
      h: computed<number>(() => props.groundSize.h - props.groundRound * 2),
      r: computed<number>(() => props.groundPos.r)
    })

    const tama = reactive({
      pos: computed<Pos>(() => Angle8.at(props.tamaX, ground.w, ground.h))
    })

    const actions = {
      currentAction: computed<string>(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const comp = tamasanMain.value as any
        return comp.currentAction
      }),
      async step (stepDur = 1000) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const comp = tamasanMain.value as any
        await comp.step(stepDur)
      },
      async jump () {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const comp = tamasanMain.value as any
        await comp.waitActionEnd()
        await comp.jump()
      },
      async jumpTurn () {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const comp = tamasanMain.value as any
        await comp.jumpTurn()
      }
    }

    return {
      tamasanMain,
      ground,
      tama,
      actions
    }
  }
})
</script>

<style lang="scss" scoped>
.tama-hoo-root {
  background: #eee;
}
</style>
