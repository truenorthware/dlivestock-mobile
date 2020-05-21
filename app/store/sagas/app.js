import { all, put, takeLatest, select } from 'redux-saga/effects'

import { AppCreators, AppTypes } from 'store/actions/app'
import { AuthCreators } from 'store/actions/auth'
import { isAuthenticated } from 'store/selectors/session'

function* startup() {
  const authenticated = yield select(isAuthenticated)
  if (authenticated) {
    yield put(AuthCreators.signInToken())
  } else {
    yield put(AppCreators.completeRehydration())
  }
}

export default function* main() {
  yield all([takeLatest(AppTypes.STARTUP, startup)])
}
