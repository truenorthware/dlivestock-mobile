import firebase from 'react-native-firebase'
import { AsyncStorage } from 'react-native'

async function getToken() {
  let fcmToken = await AsyncStorage.getItem('fcmToken')
  if (!fcmToken) {
    try {
      fcmToken = await firebase.messaging().getToken()
      if (fcmToken) {
        // user has a device token
        await AsyncStorage.setItem('fcmToken', fcmToken)
      }
    } catch (e) {
      console.log(e)
    }
  }
  return fcmToken
}

async function requestPermission() {
  try {
    await firebase.messaging().requestPermission()
    // User has authorised
    return getToken()
  } catch (error) {
    // User has rejected permissions
    console.log('permission rejected')
    return null
  }
}

export async function getFcmToken() {
  const enabled = await firebase.messaging().hasPermission()
  if (enabled) {
    return getToken()
  }
  return requestPermission()
}
