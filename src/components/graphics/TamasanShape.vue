<template>
<ECont :w="204" :h="298" :x="x" :y="y" :r="r" :dur="dur">
  <ECont img="/img/TamaBody.svg" :x="9" :y="0" :w="152" :h="298"></ECont>
  <ECont img="/img/Katsuo.svg" :x="31" :y="129" :w="173" :h="107" :r="katsuoR" :dur="0"></ECont>
  <ECont img="/img/TamaFront.svg" :x="0" :y="29" :w="132" :h="187" ></ECont>
  <slot />
</ECont>
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api'
export default createComponent({
  name: 'TamasanShape',
  props: {
    katsuoR: { type: Number, default: 0 },
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    r: { type: Number, default: 0 },
    dur: { type: Number, default: 1000 }
  },
  setup () {
    return {}
  }
})
</script>
