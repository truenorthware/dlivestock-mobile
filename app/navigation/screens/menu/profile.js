import React from 'react'

import { createStackNavigator } from 'react-navigation'
import { fromRight } from 'react-navigation-transitions'

import PickingService from 'services/picking'

import { menu, profile } from 'constants/routeNames'

import { Main as Header } from 'components/headers/Main'

import Profile from 'screens/Menu/Profile'
import Business from 'screens/Verification/Business'
import Property from 'screens/Verification/Property'

import { MenuButton } from 'components/ui'

const SCREENS = {
  [profile.userInfo]: {
    screen: Profile,

    navigationOptions: props => ({
      title: 'Edit Profile',
      headerLeft: <MenuButton navigation={props.navigation} />,
    }),
  },
  [profile.business]: {
    screen: Business,

    navigationOptions: () => ({
      title: 'Edit Business Info',
    }),
  },
  [profile.property]: {
    screen: Property,

    navigationOptions: () => ({
      title: 'Edit Properties',
    }),
  },
}

const CONFIG = {
  initialRouteName: profile.userInfo,

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

const ProfileNavigator = createStackNavigator(SCREENS, CONFIG)

export default {
  [menu.profile]: {
    screen: ProfileNavigator,
  },
}
