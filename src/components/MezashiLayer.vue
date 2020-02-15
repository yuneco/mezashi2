<template>
  <div class="mezashi-layer-root">
    <Mezashi v-for="mezashi in mezashisData" :key="mezashi.id"
      :pos="mezashi.fireat"
    />
  </div>
</template>

<script lang="ts">
import { createComponent, reactive } from '@vue/composition-api'
import Mezashi from './Mezashi.vue'
import Pos from '../lib/Pos'

interface MezashiData {
  id: string;
  fireat: Pos;
}

export default createComponent({
  components: {
    Mezashi
  },
  setup () {
    const mezashisData = reactive<MezashiData[]>([])
    /** 指定位置にメザシを追加 */
    const fire = (pos: Pos) => {
      mezashisData.push({
        id: `mezashi-${Math.random()}`,
        fireat: pos
      })
    }
    /** メザシ終了時のコールバック = mezashisDataから対象メザシを削除 */
    const onFinMezashi = (mezashi: MezashiData) => {
      const index = mezashisData.findIndex(v => v === mezashi)
      if (index > -1) {
        mezashisData.splice(index, 1)
      }
    }
    return {
      mezashisData, fire, onFinMezashi
    }
  }
})
</script>

<style lang="scss" scoped>
.mezashi-layer-root {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
