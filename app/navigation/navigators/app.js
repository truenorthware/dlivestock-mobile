import { createSwitchNavigator } from 'react-navigation'

import { navigators, app } from 'constants/routeNames'

import progress from 'navigation/screens/app/progress'
import redirector from 'navigation/screens/app/redirector'

import { screen as auth } from './auth'
import { screen as menu } from './menu'
import { screen as verification } from './verification'

const SCREENS = {
  ...auth,
  ...menu,
  ...verification,

  ...redirector,
  ...progress,
}

const CONFIG = {
  initialRouteName: app.redirector,
}

const AppNavigator = createSwitchNavigator(SCREENS, CONFIG)

export const screen = {
  [navigators.app]: {
    screen: AppNavigator,
  },
}

export default AppNavigator
