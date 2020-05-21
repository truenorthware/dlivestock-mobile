import { connect } from 'react-redux'

import { AuthCreators } from 'store/actions/auth'

import Component from './SignIn'

const ACTIONS = {
  onSignIn: AuthCreators.signInRequest,
}

export default connect(
  null,
  ACTIONS,
)(Component)
