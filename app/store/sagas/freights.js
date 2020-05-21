import { all, call, put, takeLatest } from 'redux-saga/effects'

import noop from 'lodash/noop'

import { CommonMessages } from 'services/messages'
import { FreightsTypes, FreightsCreators } from 'store/actions/freights'

function* getFreights(api, { resolve = noop, reject = noop }) {
  const response = yield call(api.freights.getFreights)

  if (response.ok && response.data.result === 'ok') {
    yield put(FreightsCreators.getFreightsSuccess(response.data.data))
    resolve(response.data.data)
  } else {
    yield put(FreightsCreators.getFreightsFailure())
    reject(response.data || { message: CommonMessages.Undefined_error })
  }
}

export default function* main(api) {
  yield all([takeLatest(FreightsTypes.GET_FREIGHTS_REQUEST, getFreights, api)])
}
