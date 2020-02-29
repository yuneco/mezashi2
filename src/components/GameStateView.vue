<template>
  <div class="game-state-view-root">
    <div class="state-view">
      <div class="level">
        <div class="area-label">LEVEL</div>
        <div class="area-contents">{{ level }}</div>
      </div>
      <div class="bullet">
        <div class="chargeBar" :class="{ charging: isCharging }"></div>
        <div class="mezashis">
          <template v-if="bullet">
            <MezashiShape v-for="(mz, index) of mezashisState" :key="index"
              class="mezashi"
              :hasFill="mz"
            />
          </template>
          <div class="reloading-msg" v-if="!bullet">
            RELOADING...
          </div>
        </div>
      </div>
      <div class="score">
        <div class="area-label">SCORE</div>
        <div class="area-contents">{{ score }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { createComponent, computed } from '@vue/composition-api'
import MezashiShape from './graphics/MezashiShape.vue'

export default createComponent({
  name: 'GameStateView',
  props: {
    level: { type: Number, default: 0 },
    bullet: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    isCharging: { type: Boolean, default: false }
  },
  components: {
    MezashiShape
  },
  setup (props) {
    const MAXMEZASHI = 6
    const mezashisState = computed(() => {
      return Array(MAXMEZASHI).fill(false).map((_, index) => index <= props.bullet - 1)
    })
    return {
      mezashisState
    }
  }
})
</script>

<style lang="scss" scoped>
.game-state-view-root {
  position: absolute;
  width: 100%;
}
.state-view {
  width: 100%;
  display: flex;
  > div {
    height: 50px;
    background-color: rgb(217, 235, 232);
    text-align: center;
    padding-top: 5px;
  }
  .level {
    flex-basis: 30%;
  }
  .bullet {
    flex-basis: 40%;
    min-width: 160px;
    line-height: 50px;
  }
  .score {
    flex-basis: 30%;
  }
  .area-label {
    font-size: 11px;
    letter-spacing: 0.2em;
    color: #316285;
    line-height: 20px;
  }
  .area-contents {
    font-size: 24px;
    color: #316285;
    line-height: 30px;
  }
}
.mezashi {
  margin-right: 2px;
}
.reloading-msg {
  font-weight: bold;
  letter-spacing: 0.3em;
  color: #316285;
}
.chargeBar {
  position: absolute;
  width: 0%;
  height: 5px;
  top: 0;
  left: 0;
  background-color: #6295a5;
  transition: width 0ms;
  &.charging {
    width: 100%;
    transition: width 2000ms;
  }
}
</style>
