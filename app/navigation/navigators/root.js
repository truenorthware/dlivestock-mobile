import { createStackNavigator, createAppContainer } from 'react-navigation'

import { navigators } from 'constants/routeNames'

import { screen as app } from './app'

const SCREENS = {
  ...app,
}

const CONFIG = {
  initialRouteName: navigators.app,

  mode: 'modal',

  defaultNavigationOptions: {
    header: null,
  },
}

const RootNavigator = createStackNavigator(SCREENS, CONFIG)
const RootContainer = createAppContainer(RootNavigator)

export default RootContainer
