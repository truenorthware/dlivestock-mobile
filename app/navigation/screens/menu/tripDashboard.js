import React from 'react'

import { createStackNavigator } from 'react-navigation'
import { fromRight } from 'react-navigation-transitions'

import PickingService from 'services/picking'

import { menu, tripDashboard } from 'constants/routeNames'

import { Main as Header } from 'components/headers'
import { OpenDrawerBtn } from 'components/blocks'

import TripDashboard from 'screens/Menu/TripDashboard'

import { MenuButton } from 'components/ui'

const SCREENS = {
  [tripDashboard.view]: {
    screen: TripDashboard,

    navigationOptions: props => ({
      title: 'Trip Dashboard',
      headerLeft: <MenuButton navigation={props.navigation} />,
      headerRight: <OpenDrawerBtn />,
    }),
  },
}

const CONFIG = {
  initialRouteName: tripDashboard.view,

  headerMode: 'screen',
  cardShadowEnabled: false,

  transitionConfig: () =>
    PickingService.platformLazy({
      android: () => fromRight(),
    }),

  defaultNavigationOptions: {
    header: props => <Header {...props} />,
  },
}

const TripDashboardNavigator = createStackNavigator(SCREENS, CONFIG)

export default {
  [menu.tripDashboard]: {
    screen: TripDashboardNavigator,
  },
}
