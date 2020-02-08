// eslint-disable-next-line @typescript-eslint/no-explicit-any
const to = (target: Record<string, any>, props: Record<string, any>, dur: number, easing = 'ease') => {
  Object.keys(props).forEach(k => {
    target[k] = props[k]
  })
  target.dur = dur ?? props.dur ?? target.dur
  target.easing = easing
  return new Promise(resolve => window.setTimeout(resolve, target.dur))
}

export default { to }
