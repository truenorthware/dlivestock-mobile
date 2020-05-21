import { Platform, PermissionsAndroid } from 'react-native'

export const requestLocationPermission = async message => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Direct Livestock Location Permission',
        message: message || 'Direct Livestock collects your location data while you are driving.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    )

    return granted === PermissionsAndroid.RESULTS.GRANTED
  }

  return true
}
