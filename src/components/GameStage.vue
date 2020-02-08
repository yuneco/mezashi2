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
        color="#8cc2c0"
        :a="planet === activePlanet ? 1 : 0.5"
        :round="planet.round"
        :pos="planet.pos" :size="planet.size" />
      <TamaHome ref="tamaHomeComp"
        :tamaX="debug.tamaX / 100"
        :groundPos="tamaHome.pos" :groundSize="tamaHome.size" :groundRound="tamaHome.round"
        :dur="tamaHome.isJumping ? 3000 : 700"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { createComponent, reactive, computed, ref, onMounted } from '@vue/composition-api'
import TamaHome from './TamaHome.vue'
import Planet from './Planet.vue'
import Pos from '../lib/Pos'
import Size from '../lib/Size'

export default createComponent({
  components: {
    TamaHome,
    Planet
  },
  setup () {
    const tamaHomeComp = ref(TamaHome)

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
      isJumping: false
    })

    const stageData = reactive({
      width: window.innerWidth,
      height: window.innerHeight,
      cameraX: computed<number>(() => window.innerWidth / 2 - activePlanet.value.pos.x),
      cameraY: computed<number>(() => window.innerHeight / 2 - activePlanet.value.pos.y)
    })

    const debug = reactive({
      tamaX: 0,
      planetR: 0,
      jump: () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tama = tamaHomeComp.value as any
        tama.actions.jump()
      },
      nextPlanet: async () => {
        tamaHome.isJumping = true
        const crP = activePlanet.value
        planetsState.planets.push({
          id: Math.random(),
          pos: new Pos(crP.pos.x + (Math.random() - 0.5) * 100,
            crP.pos.y - 500 - (Math.random() - 0.5) * 200,
            180 + (Math.random() - 0.5) * 50
          ),
          size: new Size(300 + Math.random() * 100, 400 + Math.random() * 100),
          round: 20 + Math.random() * 100
        })
        if (planetsState.planets.length >= 3) {
          planetsState.planets.shift()
        } else {
          planetsState.activeIndex += 1
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tama = tamaHomeComp.value as any
        await tama.actions.jumpTurn()
        tamaHome.isJumping = false
      }
    })

    onMounted(() => {
      window.setInterval(() => {
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
          tama.actions.step(700)
        }
      }, 710)
    })

    return {
      tamaHomeComp,
      planetsState,
      activePlanet,
      tamaHome,
      stageData,
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
