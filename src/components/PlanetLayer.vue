<template>
  <div class="palnet-layer">
    <Planet v-for="planet in planetsState.planets" :key="planet.id"
    ref="planetComps"
    color="#8cc2c0"
    :a="planet === activePlanet ? 1 : 0.5"
    :round="planet.round"
    :hasCat="planet === activePlanet"
    :maxCat="maxNekos"
    :catInterval="4000 / maxNekos + 300"
    :pos="planet.pos" :size="planet.size" />
  </div>
</template>

<script lang="ts">
import { createComponent, reactive, computed, ref } from '@vue/composition-api'
import Planet from './Planet.vue'
import Pos from '../lib/Pos'
import Size from '../lib/Size'
import MathUtil from '../lib/MathUtil'

interface PlanetState {
  id: string;
  pos: Pos;
  size: Size;
  round: number;
}

interface PlanetsState {
  activeIndex: number;
  planets: PlanetState[];
}

const createNrePlanet = (currentPlanet: PlanetState): PlanetState => {
  const MIN_W = window.innerWidth * 0.35
  const MAX_W = window.innerWidth * 0.50
  const MIN_H = window.innerHeight * 0.30
  const MAX_H = window.innerHeight * 0.45

  const MIN_DX = 0
  const MAX_DX = window.innerWidth * 0.25
  const MIN_DY = -MIN_H * 1.5
  const MAX_DY = -MAX_H * 1.5

  const x = currentPlanet.pos.x + MathUtil.between(MIN_DX, MAX_DX)
  const y = currentPlanet.pos.y + MathUtil.between(MIN_DY, MAX_DY)
  const r = 180 + MathUtil.between(0, 50)
  const w = MathUtil.between(MIN_W, MAX_W)
  const h = MathUtil.between(MIN_H, MAX_H)

  const planet = {
    id: `palnet-${Math.random()}`,
    pos: new Pos(x, y, r),
    size: new Size(w, h),
    round: 20 + Math.random() * 20
  }

  return planet
}

export default createComponent({
  components: {
    Planet
  },
  props: {
    level: { type: Number, default: 1 }
  },
  setup (props) {
    const planetComps = ref<InstanceType <typeof Planet>[]>(null)
    const planetsState = reactive<PlanetsState>({
      activeIndex: 0,
      planets: [
        {
          id: `planet-${Math.random()}`,
          pos: new Pos(230, 350, 150),
          size: new Size(200, 200),
          round: 20
        }
      ]
    })

    const maxNekos = computed<number>(() => {
      const MIN = 3
      const STEP = 1
      return MIN + (props.level - 1) * STEP
    })

    /** 現在のPlanetを返します */
    const activePlanet = computed<PlanetState>(() => planetsState.planets[planetsState.activeIndex])

    /**
     * 次のPlanetを生成し、activePlanetを新たに生成したPlanetに変更します
     */
    const nextPlanet = (): void => {
      planetsState.planets.push(createNrePlanet(activePlanet.value))
      if (planetsState.planets.length >= 3) {
        planetsState.planets.shift()
      } else {
        planetsState.activeIndex += 1
      }
    }

    return {
      planetComps,
      planetsState,
      activePlanet,
      nextPlanet,
      maxNekos
    }
  }
})
</script>
