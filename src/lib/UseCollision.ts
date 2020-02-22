import { reactive, ref } from '@vue/composition-api'
import CollisionDef from './CollisionDef'
import TBox from './TBox'

let seq = 0

const useCollision = () => {
  seq++
  const collisionDef = reactive<CollisionDef>({
    uid: `useCollision-${seq}`,
    tagName: 'noname',
    safeMargin: 0.2,
    onhit: null
  })

  const el = ref<Vue>(null)
  const collisionBox = () => {
    const elem = el.value
    if (!elem) { return null }
    const rect = elem.$el.getBoundingClientRect()
    const marginX = rect.width * collisionDef.safeMargin
    const marginY = rect.height * collisionDef.safeMargin
    const box: TBox = [rect.x + marginX, rect.y + marginY, rect.x + rect.width - marginX, rect.y + rect.height - marginY]
    return box
  }

  const initCollisionDef = (self: Vue, name: string, onhit?: (c: Vue, name: string, i: number) => void) => {
    el.value = self
    collisionDef.tagName = name
    collisionDef.onhit = onhit || null
  }

  return { collisionDef, initCollisionDef, collisionBox }
}

export default useCollision
