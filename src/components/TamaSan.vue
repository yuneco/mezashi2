<template>
  <ECont
    :w="base.w" :h="base.h"
    :s="[base.s * act.sx, base.s * act.sy]"
    :x="-base.w/2 + act.x" :y="-base.h * (act.isCenterOrigin ? 0.75 : 1) + act.y"
    :r="act.r"
    :dur="act.dur"
    :easing="act.easing"
    :ox="50" :oy="act.isCenterOrigin ? 50 : 100"
  >
    <ECont
      img="/img/tama.svg"
      :w="base.w" :h="base.h"
      :r="turnAct.r"
      :dur="turnAct.dur"
    />
  </ECont>
</template>

<script lang="ts">
import { createComponent, reactive, ref } from '@vue/composition-api'
import Tween from '../lib/Tween'
export default createComponent({
  props: {
  },
  setup () {
    const base = reactive({
      w: 156,
      h: 300,
      s: 0.5
    })
    const act = reactive({
      x: 0,
      y: 0,
      sx: 1,
      sy: 1,
      r: 0,
      isCenterOrigin: false,
      esaing: 'ease'
    })
    const turnAct = reactive({
      r: 0,
      dur: 0
    })
    const currentAction = ref<string>('')
    const actionEndHandlers: Function[] = []
    const onActionEnd = () => {
      actionEndHandlers.forEach(f => f())
      actionEndHandlers.length = 0
      currentAction.value = ''
    }

    const step = async (dur = 1000) => {
      currentAction.value = 'step'
      await Tween.to(act, { sy: 0.8 }, dur * 0.2)
      await Tween.to(act, { sy: 1.0, y: -20 }, dur * 0.3, 'ease-out')
      await Tween.to(act, { sy: 0.9, y: 0 }, dur * 0.3, 'ease-in')
      await Tween.to(act, { sy: 1.0 }, dur * 0.2)
      onActionEnd()
    }

    const jump = async () => {
      currentAction.value = 'jump'
      await Tween.to(act, { sy: 0.8 }, 200)
      await Tween.to(act, { y: -100, sy: 1.1 }, 800, 'ease-out')
      await Tween.to(act, { y: 0, sy: 0.8 }, 800, 'ease-in')
      await Tween.to(act, { sy: 1.0 }, 300)
      onActionEnd()
    }

    const _turn = async (dur = 4000) => {
      await Tween.to(turnAct, { r: 360 }, dur)
      await Tween.to(turnAct, { r: 0 }, 0)
    }

    const jumpTurn = async () => {
      currentAction.value = 'jumpTurn'
      await Tween.to(act, { sy: 0.8, r: -10 }, 200)
      _turn(4000) // DO NOT WAIT HERE
      await Tween.to(act, { y: -300, sy: 1.1 }, 2000, 'ease-out')
      await Tween.to(act, { y: 0, sy: 0.8, r: 10 }, 2000, 'ease-in')
      await Tween.to(act, { sy: 1.0, r: 0 }, 300)
      onActionEnd()
    }

    const waitActionEnd = async () => {
      if (!currentAction.value) { return Promise.resolve() }
      return new Promise(resolve => {
        actionEndHandlers.push(resolve)
      })
    }

    return {
      base,
      act,
      turnAct,
      step,
      jump,
      jumpTurn,
      waitActionEnd,
      currentAction
    }
  }
})
</script>
