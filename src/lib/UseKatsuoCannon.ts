import { reactive, computed } from '@vue/composition-api'

const MAX_BULLET = 6
const RELOAD_TIME = 1700

const katsuoCannon = () => {
  const cannonState = reactive({
    bulletCount: MAX_BULLET
  })
  const fire = (): boolean => {
    if (!cannonState.bulletCount) { return false }
    cannonState.bulletCount--
    if (!cannonState.bulletCount) {
      window.setTimeout(() => { cannonState.bulletCount = MAX_BULLET }, RELOAD_TIME)
    }
    return true
  }
  const bulletCount = computed<number>(() => cannonState.bulletCount)

  return {
    fire,
    bulletCount
  }
}

export default katsuoCannon
