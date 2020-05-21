import { AsyncStorage } from 'react-native'
import { persistStore } from 'redux-persist'

import reduxPersistConfig from 'config/reduxPersist'

import { AppCreators } from 'store/actions/app'

const updateReducers = store => {
  const { reducerVersion } = reduxPersistConfig

  const startup = () => store.dispatch(AppCreators.startup())

  // NOTE: Check to ensure latest reducer version
  AsyncStorage.getItem('reducerVersion')
    .then(localVersion => {
      if (localVersion !== reducerVersion) {
        console.log({
          name: 'PURGE',
          value: {
            'Old Version:': localVersion,
            'New Version:': reducerVersion,
          },
          preview: 'Reducer Version Change Detected',
          important: true,
        })

        // NOTE: Purge store
        persistStore(store, null, startup).purge()
        AsyncStorage.setItem('reducerVersion', reducerVersion)
      } else {
        persistStore(store, null, startup)
      }
    })
    .catch(() => {
      persistStore(store, null, startup)
      AsyncStorage.setItem('reducerVersion', reducerVersion)
    })
}

export default { updateReducers }
