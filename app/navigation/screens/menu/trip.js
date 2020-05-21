import React from 'react'

import { createStackNavigator } from 'react-navigation'
import { fromRight } from 'react-navigation-transitions'

import PickingService from 'services/picking'

import { menu, trip } from 'constants/routeNames'

import { Main as Header } from 'components/headers'
import { StatusBar, NewTripBtn } from 'components/blocks'

import Lobby from 'screens/Menu/Trip/Lobby'
import Map from 'screens/Menu/Trip/Map'
import EditTrip from 'screens/Menu/Trip/Edit'
import ViewMap from 'screens/Menu/Trip/View'
import Detail from 'screens/Menu/Trip/Detail'

import { MenuButton } from 'components/ui'

const SCREENS = {
  [trip.lobby]: {
    screen: Lobby,

    navigationOptions: props => ({
      title: 'Trip',
      headerLeft: <MenuButton navigation={props.navigation} />,
      headerRight: <NewTripBtn />,
    }),
  },
  [trip.map]: {
    screen: Map,

    navigationOptions: () => ({
      header: props => <StatusBar backgroundColor="transparent" {...props} />,
    }),
  },
  [trip.edit]: {
    screen: EditTrip,

    navigationOptions: () => ({
      title: 'Edit',
    }),
  },
  [trip.view]: {
    screen: ViewMap,

    navigationOptions: () => ({
      header: props => <StatusBar backgroundColor="transparent" {...props} />,
    }),
  },
  [trip.detail]: {
    screen: Detail,

    navigationOptions: () => ({
      title: 'Details',
    }),
  },
}

const CONFIG = {
  initialRouteName: trip.lobby,

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

const TripNavigator = createStackNavigator(SCREENS, CONFIG)

export default {
  [menu.trip]: {
    screen: TripNavigator,
  },
}
