import React from 'react'
import PT from 'prop-types'

import { DrawerActions } from 'react-navigation'

import { Hamburger } from './styles'

const MenuButton = ({ navigation }) => {
  const handlePress = () => {
    navigation.dispatch(DrawerActions.toggleDrawer())
  }

  return <Hamburger onPress={handlePress} />
}

MenuButton.propTypes = {
  navigation: PT.object.isRequired,
}

export { MenuButton }
