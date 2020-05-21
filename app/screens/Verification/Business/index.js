import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import { AuthCreators } from 'store/actions/auth'
import { user } from 'store/selectors/session'

import Component from './Business'

const SELECTOR = createStructuredSelector({
  user,
})

const ACTIONS = {
  onAddBusiness: AuthCreators.addBusinessInfo,
  onLogOut: AuthCreators.logOutRequest,
}

export default connect(
  SELECTOR,
  ACTIONS,
)(Component)
