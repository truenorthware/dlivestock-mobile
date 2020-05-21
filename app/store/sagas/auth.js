import { all, takeLatest, call, put } from 'redux-saga/effects'

import { NavigationActions } from 'react-navigation'

import { app, auth } from 'constants/routeNames'

import NavigationService from 'services/navigation'
import { ProfileMessages, SignUpMessages, VerificationMessages } from 'services/messages'

import { AuthCreators, AuthTypes } from 'store/actions/auth'

function* resendSms(api, { email, resolve, reject }) {
  const response = yield call(api.auth.resendSms, { email })

  if (response.ok && response.data.result === 'ok') {
    resolve(response.data.data)
  } else {
    reject(response.data || { message: SignUpMessages.Sms_request_error })
  }
}

function* verifySms(api, { email, sms, resolve, reject }) {
  const response = yield call(api.auth.verifySms, { email, sms })

  if (response.ok && response.data.result === 'ok') {
    resolve(response.data.data)
    yield put(AuthCreators.signInSuccess(response.data.data))
  } else {
    reject(response.data || { message: SignUpMessages.Sms_verification_failed })
  }
}

function* addBusinessInfo(api, { payload, resolve, reject }) {
  const response = yield call(api.auth.addBusinessInfo, payload)

  if (response.ok && response.data.result === 'ok') {
    resolve(response.data.data)
    yield put(AuthCreators.signInToken())
  } else {
    reject(response.data || { message: VerificationMessages.Undefined_error })
  }
}

function* updateProfile(api, { payload, resolve, reject }) {
  const response = yield call(api.auth.updateProfile, payload)

  if (response.ok && response.data.result === 'ok') {
    yield put(AuthCreators.signInSuccess(response.data.data))
    resolve(response.data.data)
  } else {
    reject(response.data || { message: ProfileMessages.Undefined_error })
  }
}

function* signInToken(api, { resolve, reject }) {
  const response = yield call(api.auth.signInToken)

  if (response.ok) {
    if (resolve) {
      resolve(response.data.data)
    }
    yield put(AuthCreators.signInSuccess(response.data.data))
  } else {
    yield put(AuthCreators.signInFailure(response))

    if (reject) {
      reject(response.data || { message: SignUpMessages.Undefined_error })
    }
  }
}

function* signIn(api, { email, password, fcmToken, resolve, reject, referer }) {
  const response = yield call(api.auth.signIn, {
    email,
    password,
    fcmToken,
  })

  if (response.ok) {
    yield put(AuthCreators.signInSuccess(response.data.data, referer))
    resolve(response.data.data)
  } else {
    yield put(AuthCreators.signInFailure(response))
    reject(response.data || { message: SignUpMessages.Undefined_error })
  }
}

function* signUp(api, { payload, resolve, reject }) {
  const response = yield call(api.auth.signUp, payload)

  if (response.ok) {
    resolve(response.data.data)
  } else {
    reject(response.data || { message: SignUpMessages.Undefined_error })
  }
}

function* logOut() {
  yield call(NavigationService.dispatch, NavigationActions.navigate({ routeName: app.progress }))

  yield put(AuthCreators.logOutSuccess())

  yield call(NavigationService.dispatch, NavigationActions.navigate({ routeName: auth.signIn }))
}

function* resetPassword(api, { email, resolve }) {
  const response = yield call(api.auth.resetPassword, { email })

  if (response.ok) {
    yield put(AuthCreators.resetPasswordSuccess())
  } else {
    yield put(AuthCreators.resetPasswordFailure(response))
  }

  if (resolve) {
    yield call(resolve, response)
  }
}

export default function* main(api) {
  yield all([
    takeLatest(AuthTypes.SIGN_UP_REQUEST, signUp, api),
    takeLatest(AuthTypes.RESEND_SMS_REQUEST, resendSms, api),
    takeLatest(AuthTypes.VERIFY_SMS_REQUEST, verifySms, api),
    takeLatest(AuthTypes.SIGN_IN_TOKEN, signInToken, api),
    takeLatest(AuthTypes.SIGN_IN_REQUEST, signIn, api),
    takeLatest(AuthTypes.ADD_BUSINESS_INFO, addBusinessInfo, api),
    takeLatest(AuthTypes.UPDATE_USER_PROFILE, updateProfile, api),
    takeLatest(AuthTypes.RESET_PASSWORD_REQUEST, resetPassword, api),
    takeLatest(AuthTypes.LOG_OUT_REQUEST, logOut),
  ])
}
