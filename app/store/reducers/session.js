import Immutable from 'seamless-immutable'

import { createReducer } from 'utils/redux'

import { AuthTypes } from 'store/actions/auth'

import pick from 'lodash/pick'

import { AuthEvents, trackEvent, setUser } from 'services/mixpanel'

const INITIAL_STATE = Immutable({
  user: null,
  accessToken: null,
})

const signInSuccess = (state, { user }) => {
  setUser(user.id)
  trackEvent(
    AuthEvents.Name,
    AuthEvents.SignIn,
    pick(user, [
      'firstName',
      'lastName',
      'phoneNumber',
      'email',
      'phoneVerified',
      'accountStatus',
      'allowMobile',
      'allowWeb',
      'businessName',
      'driverLicense',
      'type',
      'businessName',
      'abn',
    ]),
  )
  return state.merge({ user, accessToken: user.accessToken })
}

const signInFailure = () => INITIAL_STATE

const HANDLERS = {
  [AuthTypes.SIGN_IN_SUCCESS]: signInSuccess,
  [AuthTypes.SIGN_IN_FAILURE]: signInFailure,
}

export default createReducer(INITIAL_STATE, HANDLERS, {
  resetOn: [AuthTypes.LOG_OUT_SUCCESS],
})
