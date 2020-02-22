const between = (min: number, max: number) => {
  return min + (max - min) * Math.random()
}

export default { between }
