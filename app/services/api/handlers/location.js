import Secrets from 'react-native-config'
import io from 'socket.io-client'

let socket = null
const prevLocation = {
  latitude: null,
  longitude: null,
}

const prevDbLocation = {
  latitude: null,
  longitude: null,
}

export function initializeSocket(jwtHeader) {
  console.log(`${Secrets.HOST_PROTOCOL}://${Secrets.API_HOST}`)
  socket = io(`${Secrets.HOST_PROTOCOL}://${Secrets.API_HOST}`, {
    reconnect: true,
    transportOptions: {
      polling: { extraHeaders: { authorization: jwtHeader } },
    },
  })

  socket.on('connect', () => {
    console.log(`===============Socket Connected(${socket.id})===============`)
  })

  socket.on('disconnect', () => {
    console.log(`===============Socket Disconnected===============`)
  })

  return socket
}

export function emitLocation(payload) {
  if (!socket) {
    console.log('Abort Emit due to Socket.io is not initialized')
    return
  }

  const { driverId, latitude, longitude, isDbUpdate } = payload

  if (!isDbUpdate && prevLocation.latitude === latitude && prevLocation.longitude === longitude) {
    console.log('Abort Emit due to Same location,\nprev:', prevLocation, '\ncurrent:', payload)
    return
  }

  if (
    isDbUpdate &&
    prevDbLocation.latitude === latitude &&
    prevDbLocation.longitude === longitude
  ) {
    console.log('Abort Emit due to Same location,\nprev:', prevLocation, '\ncurrent:', payload)
    return
  }

  if (isDbUpdate) {
    prevDbLocation.latitude = latitude
    prevDbLocation.longitude = longitude
  } else {
    prevLocation.latitude = latitude
    prevLocation.longitude = longitude
  }
  console.log(`EMIT: syncDriverLocation-${driverId}`, payload)
  socket.emit(`syncDriverLocation-${driverId}`, payload)
}

export function addReceiveLocationListener(tripId, callback) {
  socket.on(`syncDriverToTrip-${tripId}`, callback)
}

export function removeReceiveLocationListener(tripId, callback) {
  socket.off(`syncDriverToTrip-${tripId}`, callback)
}

export function angleFromCoordinate(lat1, long1, lat2, long2) {
  const dLon = long2 - long1

  const y = Math.sin(dLon) * Math.cos(lat2)
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon)

  let brng = Math.atan2(y, x)

  brng *= 180 / Math.PI
  console.log(brng)
  brng = (brng + 360) % 360
  // brng = 360 - brng // count degrees counter-clockwise - remove to make clockwise

  return brng
}
