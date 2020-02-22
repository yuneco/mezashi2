<template>
  <div class="game-stage-root">
    <span>{{ stageData.level }}</span>
    <GameController class="controller"
      @esc="nextPlanet"
      @jump="tamaJump"
    />

    <div class="stageEventLayer" @click.capture.self="clickStage"></div>
    <div class="stage"
      :style="{
        transform: `translate(${stageData.cameraX}px, ${stageData.cameraY}px)`
      }"
    >
      <PlanetLayer ref="planetLayerComp"
        :level="stageData.level"
      />

      <TamaHome ref="tamaHomeComp"
        :tamaX="tamaHome.tamaX / 100"
        :groundPos="tamaHome.pos" :groundSize="tamaHome.size" :groundRound="tamaHome.round"
        :dur="tamaHome.isJumpingToNextPlanet ? 3000 : 700"
        @gameover="gameover"
        @jumpstart="tamaEvents.jumpStart"
        @jumpend="tamaEvents.jumpEnd"
      />

      <MezashiLayer
        ref="mezashiLayerComp"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { createComponent, reactive, computed, ref, onMounted, onBeforeUnmount } from '@vue/composition-api'
import TamaHome from './TamaHome.vue'
import PlanetLayer from './PlanetLayer.vue'
import MezashiLayer from './MezashiLayer.vue'
import GameController from './GameController.vue'
import Pos from '../lib/Pos'
import Size from '../lib/Size'
import CollisionDetector from '../lib/CollisionDetector'

const ROUNDX = 800

export default createComponent({
  components: {
    TamaHome,
    PlanetLayer,
    MezashiLayer,
    GameController
  },
  setup () {
    const tamaHomeComp = ref<InstanceType<typeof TamaHome>>(null)
    const planetLayerComp = ref<InstanceType<typeof PlanetLayer>>(null)
    const mezashiLayerComp = ref<InstanceType<typeof MezashiLayer>>(null)

    const activePlanet = computed(() => {
      const comp = planetLayerComp.value
      if (!comp) { return null }
      return comp.activePlanet
    })

    const tamaHome = reactive({
      pos: computed<Pos>(() => activePlanet.value?.pos || new Pos(0, 0, 0)),
      size: computed<Size>(() => activePlanet.value?.size || new Size(0, 0)),
      round: computed<number>(() => activePlanet.value?.round || 0),
      isJumpingToNextPlanet: false,
      isJumping: false,
      tamaX: 0
    })

    const stageData = reactive({
      width: window.innerWidth,
      height: window.innerHeight,
      cameraX: computed<number>(() => window.innerWidth / 2 - (activePlanet.value?.pos.x || 0)),
      cameraY: computed<number>(() => window.innerHeight / 2 - (activePlanet.value?.pos.y || 0)),
      isGameover: false,
      level: 1,
      isUnmounted: false
    })

    // 衝突判定
    const collisionDetector = new CollisionDetector()
    const detectCollision = () => {
      const planetCompsValue = planetLayerComp.value?.planetComps
      const tamaHomeCompValue = tamaHomeComp.value
      const tama = tamaHomeCompValue ? tamaHomeCompValue.tamasanMain : null
      const mezhashiLayerCompValue = mezashiLayerComp.value
      const comps: Vue[] = []
      if (tama) {
        comps.push(tama as unknown as Vue)
      }
      if (planetCompsValue) {
        planetCompsValue.forEach(p => {
          const nekos = p.nekoComs as unknown as Vue[]
          if (nekos && nekos.length) {
            comps.push(...nekos)
          }
        })
      }
      if (mezhashiLayerCompValue) {
        const mezashiComps = mezhashiLayerCompValue.mezashiComps
        if (mezashiComps && mezashiComps.length) {
          const mezashis = mezashiComps as unknown as Vue[]
          comps.push(...mezashis)
        }
      }
      collisionDetector.clear()
      collisionDetector.add(...comps)
      collisionDetector.detect()
    }

    // ゲームオーバー時
    const gameover = () => {
      stageData.isGameover = true
      stageData.level = 1
    }

    // たまさんイベント
    const tamaEvents = {
      jumpStart () {
        tamaHome.isJumping = true
      },
      jumpEnd () {
        tamaHome.isJumping = false
      }
    }

    // メザシ発射
    const fireMezashi = (destX: number, destY: number) => {
      const mezashiLayer = mezashiLayerComp.value
      const tama = tamaHomeComp.value
      if (!mezashiLayer || !tama) { return }
      const tamaPos = tama.getTamaPos()
      if (!tamaPos) { return }
      const cameraPos = new Pos(-stageData.cameraX, -stageData.cameraY, 0)
      const tamaStagePos = tamaPos.add(cameraPos)
      const rad = Math.atan2((destY - tamaStagePos.y), (destX - tamaStagePos.x))
      const angle = rad / Math.PI * 180
      mezashiLayer.fire(new Pos(tamaStagePos.x, tamaStagePos.y, angle))
    }
    const clickStage = (ev: MouseEvent) => {
      fireMezashi(ev.offsetX - stageData.cameraX, ev.offsetY - stageData.cameraY)
    }

    const nextPlanet = async () => {
      const planetLayerValue = planetLayerComp.value
      if (!planetLayerValue) { return }
      stageData.level++
      planetLayerValue.nextPlanet()
      tamaHome.tamaX = Math.ceil(tamaHome.tamaX / ROUNDX) * ROUNDX
      tamaHome.isJumpingToNextPlanet = true
      const tamaHomeCompValue = tamaHomeComp.value
      if (!tamaHomeCompValue) { return }
      await tamaHomeCompValue.actions.jumpTurn()
      tamaHome.isJumpingToNextPlanet = false
    }

    const tamaJump = () => {
      const tamaHomeCompValue = tamaHomeComp.value
      if (!tamaHomeCompValue) { return }
      tamaHomeCompValue.actions.jump()
    }

    onMounted(() => {
      const collisionDetectTimer = window.setInterval(() => {
        if (stageData.isUnmounted) {
          window.clearInterval(collisionDetectTimer)
        }
        detectCollision()
      }, 1000 / 20)

      const keyTimeLen = 710
      let nextKeyTime = Date.now()
      const nextKeyFrame = () => {
        if (stageData.isGameover || tamaHome.isJumping) { return }
        const STEPX = 30
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tama = tamaHomeComp.value as any
        if (tama.actions.currentAction.value) { return }
        tamaHome.tamaX += STEPX
        if (tamaHome.tamaX % ROUNDX >= ROUNDX * 0.6) {
          tamaHome.tamaX = Math.ceil(tamaHome.tamaX / ROUNDX) * ROUNDX
          nextPlanet()
        } else {
          tama.actions.step(keyTimeLen - 20)
        }
      }
      const ticker = () => {
        if (Date.now() > nextKeyTime) {
          nextKeyTime += keyTimeLen
          nextKeyFrame()
        }
        if (!stageData.isUnmounted) {
          requestAnimationFrame(ticker)
        }
      }
      ticker()
    })

    onBeforeUnmount(() => {
      console.log('Unmounted')
      stageData.isUnmounted = true
    })

    return {
      tamaHomeComp,
      planetLayerComp,
      mezashiLayerComp,
      activePlanet,
      tamaHome,
      tamaEvents,
      stageData,
      gameover,
      clickStage,
      nextPlanet,
      tamaJump
    }
  }

})
</script>

<style lang="scss" scoped>
.game-stage-root {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
.stage {
  position: absolute;
  top: 0;
  left: 0;
  transition: transform 4s ease;
  border: 1px solid red;
}
.stageEventLayer{
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 10;
}
.controller {
  z-index: 11;
}
</style>
