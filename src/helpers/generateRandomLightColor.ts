export function generateLightColor() {
  const hue = Math.floor(Math.random() * 360)
  const saturation = Math.floor(Math.random() * (100 + 1)) + '%'
  const lightness = Math.floor((1 + Math.random()) * (100 / 2.25 + 1)) + '%'
  return 'hsl(' + hue + ', ' + saturation + ', ' + lightness + ')'
}

export default generateLightColor
