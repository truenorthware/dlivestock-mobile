import superagent from 'superagent'

import { Dimensions } from 'react-native'

import Secrets from 'react-native-config'

import get from 'lodash/get'

import getDistance from 'geolib/es/getDistance'

const ScreenWidth = Dimensions.get('window').width

const calcZoomFromBounds = (bounds, width, height) => {
  const WORLD_DIM = { height: 256, width: 256 }
  const ZOOM_MAX = 21

  const latRad = lat => {
    const sin = Math.sin((lat * Math.PI) / 180)
    const radX2 = Math.log((1 + sin) / (1 - sin)) / 2
    return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2
  }

  const zoom = (mapPx, worldPx, fraction) =>
    Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2)

  const ne = bounds.northeast
  const sw = bounds.southwest

  const latFraction = (latRad(ne.lat) - latRad(sw.lat)) / Math.PI

  const lngDiff = ne.lng - sw.lng
  const lngFraction = (lngDiff < 0 ? lngDiff + 360 : lngDiff) / 360

  const latZoom = zoom(height, WORLD_DIM.height, latFraction)
  const lngZoom = zoom(width, WORLD_DIM.width, lngFraction)

  return Math.min(latZoom, lngZoom, ZOOM_MAX)
}

const calcCenterFromBounds = ({ northeast, southwest }) => ({
  latitude: (northeast.lat + southwest.lat) / 2.0,
  longitude: (northeast.lng + southwest.lng) / 2.0,
})

const calcDeltaFromBounds = zoom => Math.exp(Math.log(360) - zoom * Math.LN2) + 0.5

export const getLngLatFromAddress = async address => {
  const url = encodeURI(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${
      Secrets.GOOGLE_API_KEY
    }`,
  )

  const { text } = await superagent.get(url)
  const { results } = JSON.parse(text)

  return [get(results, '[0].geometry.location.lng'), get(results, '[0].geometry.location.lat')]
}

export const getDistanceFrom2LatLng = (position1, position2) => getDistance(position1, position2)

export const getDirectionInfoFrom2LatLng = async (position1, position2) => {
  const url = encodeURI(
    `https://maps.googleapis.com/maps/api/directions/json?origin=${position1.latitude},${
      position1.longitude
    }&destination=${position2.latitude},${position2.longitude}&key=${Secrets.GOOGLE_API_KEY}`,
  )

  const { text } = await superagent.get(url)
  const { routes = [] } = JSON.parse(text)
  if (!routes.length) {
    const lat0 = position1.latitude
    const lng0 = position1.longitude
    const lat1 = position2.latitude
    const lng1 = position2.longitude
    const bounds = {
      northeast: { lat: Math.max(lat0, lat1), lng: Math.max(lng0, lng1) },
      southwest: { lat: Math.min(lat0, lat1), lng: Math.min(lng0, lng1) },
    }
    const zoom = calcZoomFromBounds(bounds, ScreenWidth, ScreenWidth) || 0
    return {
      bounds,
      distance: 0,
      center: calcCenterFromBounds(bounds),
      zoom,
      delta: calcDeltaFromBounds(zoom),
    }
  }
  const bounds = get(routes[0], 'bounds')
  const distance = get(routes[0], 'legs[0].distance.text')
  const center = calcCenterFromBounds(bounds)
  const zoom = calcZoomFromBounds(bounds, ScreenWidth, ScreenWidth)
  console.log('zoom:', zoom)

  return {
    bounds,
    distance,
    center,
    zoom,
    delta: calcDeltaFromBounds(zoom),
  }
}
