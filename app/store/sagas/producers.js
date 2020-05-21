import { all, call, put, takeLatest } from 'redux-saga/effects'

import { ProducersTypes, ProducersCreators } from 'store/actions/producers'

function* getProducers(api) {
  const response = yield call(api.producers.getProducers)

  if (response.ok && response.data.result === 'ok') {
    yield put(ProducersCreators.getProducersSuccess(response.data.data))
  } else {
    yield put(ProducersCreators.getProducersFailure())
  }
}

export default function* main(api) {
  yield all([takeLatest(ProducersTypes.GET_PRODUCERS_REQUEST, getProducers, api)])
}
