import ImagePicker from 'react-native-image-picker'

import merge from 'lodash/merge'

const file2base64 = response => {
  const type = response.type || 'image/jpeg'
  return {
    id: new Date().valueOf(),
    name: response.fileName || 'content',
    data: `data:${type};base64,${response.data}`,
    source: { uri: response.uri },
  }
}

export const launchPicker = (dirtyOptions, callback) => {
  const DEFAULT_OPTIONS = {
    title: 'Select a NVD document image',
    storageOptions: {
      skipBackup: true,
      cameraRoll: true,
      waitUntilSaved: true,
      path: 'images',
    },
  }

  const options = merge({}, DEFAULT_OPTIONS, dirtyOptions)

  ImagePicker.showImagePicker(options, response => {
    console.log('Response = ', response)

    if (response.didCancel) {
      console.log('User cancelled image picker')
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error)
    } else if (response.customButton) {
      console.log('User tapped custom button: ', response.customButton)
    } else {
      callback(file2base64(response))
    }
  })
}

export const launchCamera = (dirtyOptions, callback) => {
  const DEFAULT_OPTIONS = {
    storageOptions: {
      skipBackup: true,
      cameraRoll: true,
      waitUntilSaved: true,
      path: 'images',
    },
  }

  const options = merge({}, DEFAULT_OPTIONS, dirtyOptions)

  ImagePicker.launchCamera(options, callback)
}

export const launchImageLibrary = (dirtyOptions, callback) => {
  const DEFAULT_OPTIONS = {
    storageOptions: {
      skipBackup: true,
      cameraRoll: true,
      waitUntilSaved: true,
      path: 'images',
    },
  }

  const options = merge({}, DEFAULT_OPTIONS, dirtyOptions)

  ImagePicker.launchImageLibrary(options, callback)
}
