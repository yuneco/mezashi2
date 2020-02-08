import Pos from './Pos'

export default {
  at: (val: number, gw: number, gh: number): Pos => {
    const segIndex = Math.floor(val)
    const prog = val - segIndex
    const turnsR = Math.floor(val / 8) * 360

    switch (segIndex % 8) {
      case 0:
        return new Pos(gw * prog, 0, 0 + turnsR)
      case 1:
        return new Pos(gw, 0, prog * 90 + turnsR)
      case 2:
        return new Pos(gw, gh * prog, 90 + turnsR)
      case 3:
        return new Pos(gw, gh, 90 + prog * 90 + turnsR)
      case 4:
        return new Pos(gw * (1 - prog), gh, 180 + turnsR)
      case 5:
        return new Pos(0, gh, 180 + prog * 90 + turnsR)
      case 6:
        return new Pos(0, gh * (1 - prog), 270 + turnsR)
      case 7:
        return new Pos(0, 0, 270 + prog * 90 + turnsR)
      default:
        return new Pos(0, 0, 0)
    }
  }
}
