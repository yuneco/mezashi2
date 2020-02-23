<template>
  <div class="start-view-root">
    <div class="info">
      ネコメザシアタックは画面をタップしてネコにメザシをあたえるだけのゆるかわゲームです
    </div>
    <div class="btns">
      <button class="btn harf" @click="start">START</button>
    </div>

    <div class="tabs">
      <MenuTab :items="menuState.items" :selected="menuState.current" @selected="changeMenu" />
      <div class="howto" v-show="isHowto">
        <img src="img/howtoplay.png" />
      </div>
      <div class="ranking" v-show="isRanking">
        <RankingList />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { createComponent, reactive, computed } from '@vue/composition-api'
import MenuTab from './MenuTab.vue'
import RankingList from './RankingList.vue'
import playSound from '../lib/playSound'

const MENU_HOWTO = 'あそびかた'
const MENU_RANKING = 'ランキング'

export default createComponent({
  components: {
    MenuTab,
    RankingList
  },
  props: {
    score: { type: Number, default: 0 }
  },
  setup (props, ctx) {
    const start = () => {
      playSound('btn')
      ctx.emit('start')
    }
    const menuState = reactive({
      items: [MENU_HOWTO, MENU_RANKING],
      current: MENU_HOWTO
    })
    const changeMenu = (item: string) => {
      menuState.current = item
    }
    const isHowto = computed(() => menuState.current === MENU_HOWTO)
    const isRanking = computed(() => menuState.current === MENU_RANKING)
    return {
      start,
      menuState,
      changeMenu,
      isHowto,
      isRanking
    }
  }
})
</script>

<style lang="scss" scoped>
.info {
  font-size: 13px;
  letter-spacing: 0.1em;
}
.btn {
   text-align: center;
  height: 60px;
  line-height: 60px;
  font-size: 20px;
  box-sizing: border-box;
  margin-left: 5px;
  margin-right: 5px;
  padding: 5px 10px;
  font-weight: bold;
  user-select: none;
  outline: none;
  color: #316285;
  background-color:transparent;
  transition: background-color 300ms;
  border: none;
  border-bottom: 2px solid #316285;
  &:active {
    background-color: #316285;
    transition: background-color 0ms;
    color:rgb(217, 235, 232);
  }
  &.harf {
    display: inline-block;
    width: 40%;
  }
  &.full {
    display: block;
    width: 100%;
    .caption {
      font-size: 16px;
      display: block;
    }
    .note {
      font-size: 11px;
      display: block;
    }
  }
}
.tabs {
  padding: 20px 0 0 0;
}
.howto {
  padding-top: 20px;
  text-align: center;
  img {
    max-width: 80%;
    border: 1px solid #316285;
  }
}
</style>
