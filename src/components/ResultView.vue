<template>
  <div class="reslut-view-root">
    <div class="score-view">
      <span>あなたは</span><span>{{ score }}</span><span>ひきの</span><br />
      <span>ネコにメザシをあたえました</span>
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
import { createComponent } from '@vue/composition-api'
import playSound from '../lib/playSound'

export default createComponent({
  props: {
    score: { type: Number, default: 0 }
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
    return {
      top,
      retry,
      tweet
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
}
</style>
