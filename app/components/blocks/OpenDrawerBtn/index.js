import React from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import { AppCreators } from 'store/actions/app'
import { userType } from 'store/selectors/session'

import { OpenBtn } from './styles'

const OpenDrawerButton = ({ onOpenDrawer }) => {
  const handlePress = () => {
    onOpenDrawer()
  }

  return <OpenBtn onPress={handlePress} />
}

const SELECTOR = createStructuredSelector({
  userType,
})

const ACTIONS = {
  onOpenDrawer: AppCreators.openDrawer,
}

export const OpenDrawerBtn = connect(
  SELECTOR,
  ACTIONS,
)(OpenDrawerButton)
