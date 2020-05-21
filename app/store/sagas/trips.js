import { all, call, put, takeLatest } from 'redux-saga/effects'

import noop from 'lodash/noop'
import isEmpty from 'lodash/isEmpty'

import { TripsTypes, TripsCreators } from 'store/actions/trips'
import { SignUpMessages } from 'services/messages'

function* getTrips(api, { resolve = noop, reject = noop }) {
  const response = yield call(api.trips.getTrips)

  if (response.ok && response.data.result === 'ok') {
    yield put(TripsCreators.getTripsSuccess(response.data.data))
    resolve(response.data.data)
  } else {
    reject(response.data || { message: SignUpMessages.Undefined_error })
  }
}

function* getTrip(api, { tripId, resolve = noop, reject = noop }) {
  const response = yield call(api.trips.getTrip, tripId)

  if (response.ok && response.data.result === 'ok') {
    resolve(response.data.data)
  } else {
    reject(response.data || { message: SignUpMessages.Undefined_error })
  }
}

function* createTrip(api, { payload, resolve = noop, reject = noop }) {
  const response = yield call(api.trips.createTrip, payload)

  if (response.ok && response.data.result === 'ok') {
    yield put(TripsCreators.createTripSuccess(response.data.data))
    resolve(response.data.data)
  } else {
    reject(
      (!isEmpty(response.data) && response.data) || { message: SignUpMessages.Undefined_error },
    )
  }
}

function* updateTrip(api, { payload, resolve = noop, reject = noop }) {
  const response = yield call(api.trips.updateTrip, payload)

  if (response.ok && response.data.result === 'ok') {
    yield put(TripsCreators.updateTripSuccess(response.data.data))
    resolve(response.data.data)
  } else {
    reject(response.data || { message: SignUpMessages.Undefined_error })
  }
}

export default function* main(api) {
  yield all([
    takeLatest(TripsTypes.GET_TRIPS_REQUEST, getTrips, api),
    takeLatest(TripsTypes.GET_TRIP_REQUEST, getTrip, api),
    takeLatest(TripsTypes.CREATE_TRIP_REQUEST, createTrip, api),
    takeLatest(TripsTypes.UPDATE_TRIP_REQUEST, updateTrip, api),
  ])
}
