import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import { AuthCreators } from 'store/actions/auth'
import { FreightsCreators } from 'store/actions/freights'
import { user, userType } from 'store/selectors/session'
import { freights } from 'store/selectors/freights'

import Component from './Profile'

const SELECTOR = createStructuredSelector({
  user,
  userType,
  freights,
})

const ACTIONS = {
  onGetFreights: FreightsCreators.getFreightsRequest,
  onUpdateProfile: AuthCreators.updateUserProfile,
}

export default connect(
  SELECTOR,
  ACTIONS,
)(Component)
