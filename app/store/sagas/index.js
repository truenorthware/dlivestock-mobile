import { all, fork } from 'redux-saga/effects'

import APIService from 'services/api'

import app from './app'
import auth from './auth'
import companies from './companies'
import freights from './freights'
import producers from './producers'
import session from './session'
import trips from './trips'
import uploader from './uploader'

export default function* main(store) {
  // NOTE: The API we use is only used from Sagas, so we create it here and pass
  //       along to the sagas which need it.
  const api = APIService.create(store)

  yield all([
    fork(app),
    fork(auth, api),
    fork(companies, api),
    fork(freights, api),
    fork(producers, api),
    fork(session),
    fork(trips, api),
    fork(uploader, api),
  ])
}
