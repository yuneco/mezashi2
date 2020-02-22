import Vue from 'vue'
import boxIntersect from 'box-intersect'
import CollisionDef from './CollisionDef'
import TBox from './TBox'

interface Collidable {
  collisionDef: CollisionDef;
  collisionBox: () => TBox | null;
}
type CollidableComponent = Vue & Collidable
type CollisionPair = [CollidableComponent, CollidableComponent]
const NonNull = <T>(value: T): value is NonNullable<T> => value !== null

const isCollidableComponent = (v: unknown): v is Collidable => {
  return v !== null &&
    typeof v === 'object' &&
    typeof (v as { collisionDef?: unknown }).collisionDef === 'object' &&
    typeof (v as { collisionBox?: unknown }).collisionBox === 'function'
}

const upperFirst = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

const diffNewResults = (lastArr: CollisionPair[], newArr: CollisionPair[]): CollisionPair[] => {
  if (!newArr.length) { return [] }
  if (!lastArr.length) { return newArr }
  const lastUidArr = lastArr.map(pare => pare[0].collisionDef.uid + '/' + pare[1].collisionDef.uid)
  const newUidArr = newArr.map(pare => pare[0].collisionDef.uid + '/' + pare[1].collisionDef.uid)
  const news: CollisionPair[] = []
  newUidArr.forEach((pareId, index) => {
    if (!lastUidArr.includes(pareId)) {
      // new //
      news.push(newArr[index])
    }
  })
  return news
}

export default class CollisionDetector {
  readonly safeMargin = 0.1
  readonly _comps: CollidableComponent[] = []
  _lastResult: CollisionPair[] = []

  add (...comps: Vue[]) {
    comps.forEach(c => {
      if (!isCollidableComponent(c)) {
        // console.warn('This component is not collidable', c)
        return
      }
      if (this._comps.includes(c)) { return }
      this._comps.push(c)
    })
  }

  clear () {
    this._comps.length = 0
  }

  detect () {
    const boxes = this._comps.map(c => {
      return c.collisionBox()
    }).filter(NonNull)
    const result: CollisionPair[] = boxIntersect(boxes).map(indexes => {
      const [i1, i2] = indexes
      const c1 = this._comps[i1]
      const c2 = this._comps[i2]
      return [c1, c2]
    })
    const diffedRes = diffNewResults(this._lastResult, result)
    this._lastResult = result
    diffedRes.forEach(pare => {
      const [c1, c2] = pare
      const c1Name = upperFirst(c1.collisionDef.tagName)
      const c2Name = upperFirst(c2.collisionDef.tagName)
      if (c1.collisionDef.onhit) {
        c1.collisionDef.onhit(c2, c2Name, 0)
      }
      if (c2.collisionDef.onhit) {
        c2.collisionDef.onhit(c1, c1Name, 1)
      }
    })
    return diffedRes
  }
}
