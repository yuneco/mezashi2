<template>
  <div class="reslut-view-root">
    <div class="score-view">
      <span>あなたは</span><span>{{ score }}</span><span>ひきの</span><br />
      <span>ネコにメザシをあたえました</span>
    </div>
    <div class="addranking-area" v-if="rankingState.rank">
      <div class="input-area" v-if="rankingState.addingStatus === 'waiting'">
        <div class="note">{{rankingState.rank}}位にランクインしました！<br />ランキングにのせる名前を入力してください：</div>
        <input type="text" v-model="rankingState.myName" />
        <button class="btn mini" @click="addToRank">OK!</button>
      </div>
      <div class="status-area note" v-if="rankingState.addingStatus === 'adding'">登録中...</div>
      <div class="status-area note" v-if="rankingState.addingStatus === 'added'">登録しました！</div>
    </div>
    <div class="btns">
      <button class="btn harf" @click="top">TOP</button>
      <button class="btn harf" @click="retry">RETRY</button>
      <button class="btn full" @click="tweet">
        <span class="caption">結果をツイートする</span>
        <span class="note">Twitterの投稿編集画面が開きます</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { createComponent, onMounted, reactive } from '@vue/composition-api'
import playSound from '../lib/playSound'
import AuthApi from '../lib/api/AuthApi'
import DocApi from '../lib/api/DocApi'
import RankingItem from '../lib/model/RankingItem'

const RANKING_ADDSTATE_WAITING = 'waiting'
const RANKING_ADDSTATE_ADDING = 'adding'
const RANKING_ADDSTATE_ADDED = 'added'

export default createComponent({
  props: {
    score: { type: Number, required: true }
  },
  setup (props, ctx) {
    const top = () => {
      playSound('btn')
      ctx.emit('top')
    }
    const retry = () => {
      playSound('btn')
      ctx.emit('retry')
    }
    const tweet = () => {
      playSound('btn')
      const text = encodeURIComponent(`ネコメザシアタックで${props.score}匹の猫にメザシをあげたよ！`)
      const pageUrl = `${document.location.protocol}//${document.location.host}/`
      const pop = window.open('', 'nekotweet')
      if (pop) {
        pop.document.body.innerHTML = 'loading...'
      }
      const twurl = `https://twitter.com/share?text=${text}&url=${pageUrl}&hashtags=MezashiAttack`
      window.open(twurl, 'nekotweet')
      ctx.emit('top')
    }

    const rankingState = reactive({
      rank: 0,
      myName: '',
      addingStatus: RANKING_ADDSTATE_WAITING
    })

    const addToRank = async () => {
      playSound('btn')
      if (!rankingState.rank || !rankingState.myName) { return }
      rankingState.addingStatus = RANKING_ADDSTATE_ADDING
      await AuthApi.getUser()
      const uid = AuthApi.uid
      if (!uid) { return }
      const item = new RankingItem(uid, rankingState.myName, props.score)
      await DocApi.addRanking(item)
      rankingState.addingStatus = RANKING_ADDSTATE_ADDED
    }

    onMounted(async () => {
      const rank = await DocApi.getRank(props.score, 10)
      // console.log('your rank is: ', rank)
      if (rank) {
        rankingState.rank = rank
      }
    })

    return {
      top,
      retry,
      tweet,
      rankingState,
      addToRank
    }
  }
})
</script>

<style lang="scss" scoped>
.btns {
  text-align: center;
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
    background-color: rgb(97, 136, 148);
    transition: background-color 0ms;
    color:rgb(217, 235, 232);
  }
  &.harf {
    display: inline-block;
    width: 40%;
  }
  &.full {
    display: inline-block;
    width: calc(80% + 10px);
    margin-top: 20px;
    .caption {
      font-size: 16px;
      line-height: 20px;
      display: block;
    }
    .note {
      font-size: 10px;
      line-height: 20px;
      letter-spacing: 0.3em;
      display: block;
    }
  }
  &.mini {
    height: 35px;
    line-height: 35px;
  }
}
.addranking-area {
  margin-top: 20px;
  padding: 20px 10px;
  background-color: #fcf4d4;
  border-radius: 10px;
  .note {
    font-size: 10px;
    font-weight: bold;
  }
  input {
    border: 2px solid #316285;
    font-size: 16px;
    padding: 5px;
  }
}
</style>
