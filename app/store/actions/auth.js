import { createActions } from 'reduxsauce'

export const { Types: AuthTypes, Creators: AuthCreators } = createActions(
  {
    /*
     * SignUp actions
     */
    signUpRequest: ['payload', 'resolve', 'reject'],
    resendSmsRequest: ['email', 'resolve', 'reject'],
    verifySmsRequest: ['email', 'sms', 'resolve', 'reject'],

    /*
     * SIgnIn actions
     */
    signInToken: [],
    signInRequest: ['email', 'password', 'fcmToken', 'referer', 'resolve', 'reject'],
    signInSuccess: ['user', 'referer'],
    signInFailure: ['error'],

    /*
     * Profile actions
     */
    addBusinessInfo: ['payload', 'resolve', 'reject'],
    updateUserProfile: ['payload', 'resolve', 'reject'],

    resetPasswordRequest: ['email', 'resolve'],
    resetPasswordSuccess: null,
    resetPasswordFailure: ['error'],

    logOutRequest: null,
    logOutSuccess: null,
  },
  { prefix: 'Auth/' },
)
