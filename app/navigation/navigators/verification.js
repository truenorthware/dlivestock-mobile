import React from 'react'
import { createStackNavigator } from 'react-navigation'

import { navigators, verification } from 'constants/routeNames'

import { Main as Header } from 'components/headers'

import business from 'navigation/screens/verification/business'
import property from 'navigation/screens/verification/property'

const SCREENS = {
  ...business,
  ...property,
}

const CONFIG = {
  initialRouteName: verification.business,

  defaultNavigationOptions: {
    header: props => <Header {...props} />,
  },
}

const VerificationNavigator = createStackNavigator(SCREENS, CONFIG)

export const screen = {
  [navigators.verification]: {
    screen: VerificationNavigator,
  },
}

export default VerificationNavigator
