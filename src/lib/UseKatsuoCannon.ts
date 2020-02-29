import { reactive, computed } from '@vue/composition-api'

const MAX_BULLET = 6
const RELOAD_TIME = 1700
const BURST_LOAD_TIME = 2800

const katsuoCannon = () => {
  const cannonState = reactive({
    bulletCount: MAX_BULLET
  })

  const reload = () => window.setTimeout(() => { cannonState.bulletCount = MAX_BULLET }, RELOAD_TIME)

  const fire = (): boolean => {
    if (!cannonState.bulletCount) { return false }
    cannonState.bulletCount--
    if (!cannonState.bulletCount) {
      reload()
    }
    return true
  }
  const fireBurst = (pressTimeMs: number): boolean => {
    if (!cannonState.bulletCount) { return false }
    if (pressTimeMs < BURST_LOAD_TIME) { return false }
    cannonState.bulletCount = 0
    reload()
    return true
  }

  const bulletCount = computed<number>(() => cannonState.bulletCount)

  return {
    fire,
    fireBurst,
    bulletCount
  }
}

export default katsuoCannon
