import { all, put, call, fork, take, select } from 'redux-saga/effects'

import { NavigationActions } from 'react-navigation'

import NavigationService from 'services/navigation'

import { app } from 'constants/routeNames'

import { AppCreators, AppTypes } from 'store/actions/app'
import { AuthTypes } from 'store/actions/auth'

import { isAuthenticated } from 'store/selectors/session'

function* restoreSession() {
  while (true) {
    const action = yield take([AppTypes.COMPLETE_REHYDRATION, AuthTypes.SIGN_IN_SUCCESS])

    const authenticated = yield select(isAuthenticated)

    if (authenticated) {
      yield put(AppCreators.completeRehydration())
      yield put(AppCreators.completeRefetch())

      if (action.type !== AppTypes.COMPLETE_REHYDRATION) {
        const { referer, params } = action.referer || {}
        yield call(
          NavigationService.dispatch,
          NavigationActions.navigate({
            routeName: referer || app.redirector,
            params,
          }),
        )
      }
    }
  }
}

export default function* main() {
  yield all([fork(restoreSession)])
}
