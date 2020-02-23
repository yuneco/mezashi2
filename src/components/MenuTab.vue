<template>
  <ul>
    <li v-for="(item, index) in items" :key="index"
      @click="select(item)"
      :class="{ selected: item === selected }"
    >{{ item }}</li>
  </ul>
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api'
import playSound from '../lib/playSound'

export default createComponent({
  props: {
    items: { type: Array, default: () => [] },
    selected: { type: String, default: '' }
  },
  setup (props, ctx) {
    const select = (item: string) => {
      playSound('shot')
      ctx.emit('selected', item)
    }
    return {
      select
    }
  }
})
</script>

<style lang="scss" scoped>
ul {
  margin: 0;
  padding: 0;
  list-style: none;
  text-align: center;
  display: flex;
  justify-content: center;
  li {
    font-size: 12px;
    color: #316285;
    padding: 3px 10px;
    border: 1px solid #316285;
    &.selected {
      background-color: #316285;
      color: rgb(217, 235, 232);
    }
    &:first-child {
      border-radius: 5px 0 0 5px;
    }
    &:last-child {
      border-radius: 0 5px 5px 0;
    }
  }
}
</style>
