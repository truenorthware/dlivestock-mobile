import { createDrawerNavigator } from 'react-navigation'

import { navigators, menu } from 'constants/routeNames'

import profile from 'navigation/screens/menu/profile'
import trip from 'navigation/screens/menu/trip'
import tripDashboard from 'navigation/screens/menu/tripDashboard'

import { Main as Drawer } from 'components/drawer'

const SCREENS = {
  ...profile,
  ...trip,
  ...tripDashboard,
}

const CONFIG = {
  initialRouteName: menu.trip,

  contentComponent: Drawer,
}

const MenuNavigator = createDrawerNavigator(SCREENS, CONFIG)

export const screen = {
  [navigators.menu]: {
    screen: MenuNavigator,
  },
}

export default MenuNavigator
