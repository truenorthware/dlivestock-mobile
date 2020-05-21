import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import { AuthCreators } from 'store/actions/auth'
import { FreightsCreators } from 'store/actions/freights'

import { freights } from 'store/selectors/freights'

import Component from './SignUp'

const SELECTOR = createStructuredSelector({ freights })

const ACTIONS = {
  onSignUp: AuthCreators.signUpRequest,
  onResendSms: AuthCreators.resendSmsRequest,
  onVerifySms: AuthCreators.verifySmsRequest,
  onGetFreights: FreightsCreators.getFreightsRequest,
}

export default connect(
  SELECTOR,
  ACTIONS,
)(Component)
