import map from 'lodash/map'
import split from 'lodash/split'
import trim from 'lodash/trim'

export const makeAcronym = text => {
  const chunks = map(split(trim(text), ' '), item => item[0].toUpperCase())

  return chunks.join('')
}

export const removeNotNumbers = text => text.replace(/[^0-9]+/g, '')

export const convertLatLng2PointString = latLng => {
  const nonCommaLatLng = latLng.replace(',', '')
  return `POINT(${nonCommaLatLng})`
}

export const convertPoint2LatLngString = point => {
  const nonBracketsPoint = point.substring(6, point.length - 1)
  return nonBracketsPoint.replace(' ', ', ')
}
