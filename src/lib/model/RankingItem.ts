export default class RankingItem {
  readonly uid: string
  name: string
  score: number
  created: number

  constructor (uid: string, name = '', score = 0, created?: number) {
    this.uid = uid
    this.name = name
    this.score = score
    this.created = created ?? Date.now()
  }
}
