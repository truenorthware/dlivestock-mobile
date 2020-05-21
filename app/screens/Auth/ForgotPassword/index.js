import { connect } from 'react-redux'

import { AuthCreators } from 'store/actions/auth'

import Component from './ForgotPassword'

const ACTIONS = {
  onResetPassword: AuthCreators.resetPasswordRequest,
}

export default connect(
  null,
  ACTIONS,
)(Component)
