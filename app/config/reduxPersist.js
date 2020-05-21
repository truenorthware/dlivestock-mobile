import { AsyncStorage } from 'react-native'

import { seamlessImmutableReconciler } from 'redux-persist-seamless-immutable'

export default {
  active: true,
  reducerVersion: '1.0.0',

  rootConfig: {
    key: 'primary',
    storage: AsyncStorage,
    whitelist: ['session', 'theme'],
    stateReconciler: seamlessImmutableReconciler,
  },

  dataConfig: {
    key: 'data',
    storage: AsyncStorage,
    whitelist: ['cache'],
  },
}
