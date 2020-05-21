import React from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import { UserTypes } from 'services/dataTypes'

import { AppCreators } from 'store/actions/app'
import { userType } from 'store/selectors/session'

import { Touchable, Text } from './styles'

const NewTripButton = props =>
  props.userType === UserTypes.Driver && (
    <Touchable onPress={props.onOpenTripForm}>
      <Text>New Trip</Text>
    </Touchable>
  )

const SELECTOR = createStructuredSelector({
  userType,
})

const ACTIONS = {
  onOpenTripForm: AppCreators.openTripForm,
}

export const NewTripBtn = connect(
  SELECTOR,
  ACTIONS,
)(NewTripButton)
