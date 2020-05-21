/**
 * @format
 */

import { AppRegistry } from 'react-native'
import App from './app/App'
import appConfig from './app/config/app'

AppRegistry.registerComponent(appConfig.bundleName, () => App)
