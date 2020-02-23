<template>
  <div class="ranking-list-root">
    <ul>
      <li v-for="(item, index) in state.rankingList" :key="`ranking-${index}`">
        <span class="no">{{index + 1}}位</span>
        <span class="name">{{item.name}}</span>
        <span class="score">{{item.score}}匹</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { createComponent, onMounted, reactive } from '@vue/composition-api'
import DocApi from '../lib/api/DocApi'
import RankingItem from '../lib/model/RankingItem'

interface RankingState {
  rankingList: RankingItem[];
}

export default createComponent({
  setup () {
    const state = reactive<RankingState>({
      rankingList: []
    })
    onMounted(async () => {
      const items = await DocApi.getRanking()
      state.rankingList.push(...items)
    })

    return {
      state
    }
  }
})
</script>

<style lang="scss" scoped>
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  li {
    padding: 5px 0;
    border-bottom: 1px dotted rgb(97, 136, 148);
    * {
      box-sizing: border-box;
    }
    .no {
      display: inline-block;
      width: 50px;
      font-size: 14px;
      text-align: right;
    }
    .name {
      display: inline-block;
      width: calc(100% - 120px);
      font-size: 14px;
      text-align: center;
      padding: 0 10px;
    }
    .score {
      display: inline-block;
      width: 70px;
      font-size: 14px;
      text-align: right;
    }
  }
}
</style>
