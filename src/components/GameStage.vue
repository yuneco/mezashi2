<template>
  <div class="game-stage-root">
    <input type="range" min="0" max="1600" v-model="debug.tamaX">
    <button @click="debug.jump">Jump</button>
    <button @click="debug.nextPlanet">NextPlanet</button>

    <div class="stage"
      :style="{
        transform: `translate(${stageData.cameraX}px, ${stageData.cameraY}px)`
      }"
    >
      <Planet v-for="planet in planetsState.planets" :key="planet.id"
        ref="planetComps"
        color="#8cc2c0"
        :a="planet === activePlanet ? 1 : 0.5"
        :round="planet.round"
        :hasCat="planet === activePlanet"
        :maxCat="2"
        :pos="planet.pos" :size="planet.size" />

      <TamaHome ref="tamaHomeComp"
        :tamaX="debug.tamaX / 100"
        :groundPos="tamaHome.pos" :groundSize="tamaHome.size" :groundRound="tamaHome.round"
        :dur="tamaHome.isJumpingToNextPlanet ? 3000 : 700"
        @gameover="gameover"
        @jumpstart="tamaEvents.jumpStart"
        @jumpend="tamaEvents.jumpEnd"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { createComponent, reactive, computed, ref, onMounted, onBeforeUnmount } from '@vue/composition-api'
import TamaHome from './TamaHome.vue'
import Planet from './Planet.vue'
import Pos from '../lib/Pos'
import Size from '../lib/Size'
import CollisionDetector from '../lib/CollisionDetector'

export default createComponent({
  components: {
    TamaHome,
    Planet
  },
  setup () {
    const tamaHomeComp = ref<InstanceType<typeof TamaHome>>(null)
    const planetComps = ref<InstanceType<typeof Planet>[]>(null)

    const planetsState = reactive({
      activeIndex: 0,
      planets: [
        {
          id: Math.random(),
          pos: new Pos(230, 350, 150),
          size: new Size(300, 350),
          round: 30
        }
      ]
    })
    const activePlanet = computed(() => planetsState.planets[planetsState.activeIndex])

    const tamaHome = reactive({
      pos: computed<Pos>(() => activePlanet.value.pos),
      size: computed<Size>(() => activePlanet.value.size),
      round: computed<number>(() => activePlanet.value.round),
      isJumpingToNextPlanet: false,
      isJumping: false
    })

    const stageData = reactive({
      width: window.innerWidth,
      height: window.innerHeight,
      cameraX: computed<number>(() => window.innerWidth / 2 - activePlanet.value.pos.x),
      cameraY: computed<number>(() => window.innerHeight / 2 - activePlanet.value.pos.y),
      isGameover: false,
      isUnmounted: false
    })

    // 衝突判定
    const collisionDetector = new CollisionDetector()
    const detectCollision = () => {
      const planetCompsValue = planetComps.value
      const tamaHomeCompValue = tamaHomeComp.value
      const tama = tamaHomeCompValue ? tamaHomeCompValue.tamasanMain : null
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
      collisionDetector.clear()
      collisionDetector.add(...comps)
      collisionDetector.detect()
    }

    // ゲームオーバー時
    const gameover = () => {
      stageData.isGameover = true
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

    // デバッグ用色々
    const debug = reactive({
      tamaX: 0,
      planetR: 0,
      jump: () => {
        const tamaHomeCompValue = tamaHomeComp.value
        if (!tamaHomeCompValue) { return }
        tamaHomeCompValue.actions.jump()
      },
      nextPlanet: async () => {
        tamaHome.isJumpingToNextPlanet = true
        const crP = activePlanet.value
        planetsState.planets.push({
          id: Math.random(),
          pos: new Pos(crP.pos.x + (Math.random() - 0.5) * 100,
            crP.pos.y - 500 - (Math.random() - 0.5) * 200,
            180 + (Math.random() - 0.5) * 50
          ),
          size: new Size(300 + Math.random() * 100, 400 + Math.random() * 100),
          round: 20 + Math.random() * 20
        })
        if (planetsState.planets.length >= 3) {
          planetsState.planets.shift()
        } else {
          planetsState.activeIndex += 1
        }
        const tamaHomeCompValue = tamaHomeComp.value
        if (!tamaHomeCompValue) { return }
        await tamaHomeCompValue.actions.jumpTurn()
        tamaHome.isJumpingToNextPlanet = false
      }
    })

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
        const ROUNDX = 800
        const STEPX = 30
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tama = tamaHomeComp.value as any
        if (tama.actions.currentAction.value) { return }
        debug.tamaX += STEPX
        if (debug.tamaX % ROUNDX >= ROUNDX * 0.6) {
          debug.tamaX = Math.ceil(debug.tamaX / ROUNDX) * ROUNDX
          debug.nextPlanet()
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
      planetComps,
      planetsState,
      activePlanet,
      tamaHome,
      tamaEvents,
      stageData,
      gameover,
      debug
    }
  }

})
</script>

<style lang="scss" scoped>
.stage {
  transition: transform 4s ease;
}
</style>
