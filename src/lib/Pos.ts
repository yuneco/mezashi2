export default class Pos {
  readonly x: number
  readonly y: number
  readonly r: number

  constructor (x = 0, y = 0, r = 0) {
    this.x = x
    this.y = y
    this.r = r
  }

  add (pOrX: Pos | number, y?: number, r?: number) {
    if (pOrX instanceof Pos) {
      const p = pOrX
      return new Pos(this.x + p.x, this.y + p.y, this.r + p.r)
    } else {
      return this.addXY(pOrX, y, r)
    }
  }

  addXY (x: number, y = 0, r = 0) {
    return new Pos(this.x + x, this.y + y, this.r + r)
  }
}
