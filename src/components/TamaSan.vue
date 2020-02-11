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
      :y="jumpAct.y"
      :s="[jumpAct.sx, jumpAct.sy]"
      :r="jumpAct.r"
      :dur="jumpAct.dur"
      :easing="jumpAct.easing"
      :w="base.w" :h="base.h"
      :ox="50" :oy="100"
    >
        <ECont
          ref="hitBody"
          img="/img/tama.svg"
          :w="base.w" :h="base.h"
          :r="turnAct.r"
          :y="turnAct.y"
          :dur="turnAct.dur"
        />
    </ECont>
  </ECont>
</template>

<script lang="ts">
import { createComponent, reactive, ref, onMounted } from '@vue/composition-api'
import Tween from '../lib/Tween'
import useCollision from '../lib/UseCollision'

export default createComponent({
  name: 'TamaSan',
  props: {
  },
  setup (props, ctx) {
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
      esaing: 'ease',
      cancelled: false
    })
    const turnAct = reactive({
      r: 0,
      y: 0,
      dur: 0,
      cancelled: false
    })
    const jumpAct = reactive({
      y: 0,
      sx: 1,
      sy: 1,
      r: 0,
      esaing: 'ease',
      dur: 0,
      jumpCount: 0
    })
    const currentAction = ref<string>('')
    const isGameover = ref(false)
    const actionEndHandlers: Function[] = []
    const onActionEnd = () => {
      const lastAction = currentAction.value
      currentAction.value = ''
      act.cancelled = false
      turnAct.cancelled = false
      actionEndHandlers.forEach(f => f(lastAction))
      actionEndHandlers.length = 0
    }

    const waitActionEnd = async (cancelAct = false, cancelTurnAct = false) => {
      if (!currentAction.value) { return Promise.resolve() }
      act.cancelled = act.cancelled || cancelAct
      turnAct.cancelled = turnAct.cancelled || cancelTurnAct
      console.log(`Wait for end = ${currentAction.value}`)
      return new Promise<string>(resolve => {
        actionEndHandlers.push(resolve)
      })
    }

    // const startAction = async (actionName: string, cancelAct = false, cancelTurnAct = false) => {
    //   await waitActionEnd(cancelAct, cancelTurnAct)
    //   currentAction.value = actionName
    // }

    const step = async (dur = 1000) => {
      await waitActionEnd(true)
      if (isGameover.value || jumpAct.jumpCount) { return }
      currentAction.value = 'step'
      await (act.cancelled || Tween.to(act, { sy: 0.8 }, dur * 0.2))
      await (act.cancelled || Tween.to(act, { sy: 1.0, y: -20 }, dur * 0.3, 'ease-out'))
      await (act.cancelled || Tween.to(act, { sy: 0.9, y: 0 }, dur * 0.3, 'ease-in'))
      await (act.cancelled || Tween.to(act, { sy: 1.0 }, dur * 0.2))
      onActionEnd()
    }

    const _turn = async (dur = 4000) => {
      await (turnAct.cancelled || Tween.to(turnAct, { r: 360 }, dur))
      await (turnAct.cancelled || Tween.to(turnAct, { r: 0 }, 0))
    }

    const jump = async () => {
      jumpAct.jumpCount++
      if (jumpAct.jumpCount === 2) { return }
      if (jumpAct.jumpCount === 3) {
        await Tween.to(jumpAct, { y: -350, sy: 0.8, r: -20 }, 700, 'ease-out')
        await Tween.to(jumpAct, { y: 0, sy: 0.8, r: 0 }, 1200, 'ease-in')
        await Tween.to(jumpAct, { sy: 1.0 }, 300)
        jumpAct.jumpCount = 0
        ctx.emit('jumpend')
        return
      }
      if (jumpAct.jumpCount >= 4) {
        return
      }
      ctx.emit('jumpstart')
      await Tween.to(jumpAct, { sy: 0.8 }, 100)
      await Tween.to(jumpAct, { y: -350, sy: 1.1 }, 700, 'ease-out')
      if (jumpAct.jumpCount >= 2) {
        Tween.to(jumpAct, { y: -500, sy: 1 }, 1000, 'ease-out')
        await _turn(1500)
      }
      if (jumpAct.jumpCount >= 3) { return }
      await Tween.to(jumpAct, { y: 0, sy: 0.8 }, 1200, 'ease-in')
      if (jumpAct.jumpCount >= 3) { return }
      await Tween.to(jumpAct, { sy: 1.0 }, 300)
      if (jumpAct.jumpCount >= 3) { return }
      jumpAct.jumpCount = 0
      ctx.emit('jumpend')
    }

    const jumpTurn = async () => {
      await waitActionEnd()
      currentAction.value = 'jumpTurn'
      await (turnAct.cancelled || Tween.to(act, { sy: 0.8, r: -10 }, 200))
      _turn(2000) // DO NOT WAIT HERE
      await (turnAct.cancelled || Tween.to(act, { y: -200, sy: 1.1 }, 1000, 'ease-out'))
      await (turnAct.cancelled || Tween.to(act, { y: 0, sy: 0.8, r: 10 }, 1000, 'ease-in'))
      await (turnAct.cancelled || Tween.to(act, { sy: 1.0, r: 0 }, 300))
      onActionEnd()
    }

    /**
     * ゲームオーバーのアニメーション
     */
    const gameover = async () => {
      if (isGameover.value) { return }
      isGameover.value = true
      await waitActionEnd(true, true)
      currentAction.value = 'gameover'
      // 中断不可 //
      await Tween.to(turnAct, { r: 20 }, 200, 'ease-out')
      await Tween.to(turnAct, { r: -90, y: 150 }, 700, 'ease-out')
      await Tween.to(turnAct, { r: -70 }, 500, 'ease-out')
      await Tween.to(turnAct, { r: -90 }, 300, 'ease-out')
      onActionEnd()
    }

    const hitBody = ref<Vue>(null)
    const { collisionDef, collisionBox, initCollisionDef } = useCollision()
    onMounted(() => {
      const hitBodyComp = hitBody.value
      if (!hitBodyComp) { return }
      const onhit = (target: Vue, name: string) => {
        if (name === 'Neko') {
          gameover()
          ctx.emit('gameover')
        }
      }
      initCollisionDef(hitBodyComp, 'tamasan', onhit)
    })

    return {
      hitBody,
      base,
      act,
      turnAct,
      jumpAct,
      step,
      jump,
      jumpTurn,
      gameover,
      waitActionEnd,
      currentAction,
      collisionDef,
      collisionBox
    }
  }
})
</script>
