/* eslint-disable @typescript-eslint/no-explicit-any */
import loadSnd from 'audio-loader'
import playSnd from 'audio-play'

const snds: {[key: string]: any} = {}
const load = (name: string) => {
  loadSnd(`/snd/${name}.mp3`).then((a: any) => { snds[name] = a })
}
load('btn')
load('catch')
load('jump')
load('jump2')
load('gameover')
load('shot')

const playSound = (name: string) => {
  const audio = snds[name]
  if (!audio) {
    // console.warn(`No sound for: ${name}`)
    return
  }
  playSnd(audio)
}

export default playSound
