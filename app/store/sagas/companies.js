import { all, call, put, takeLatest } from 'redux-saga/effects'

import { CompaniesTypes, CompaniesCreators } from 'store/actions/companies'

function* getCompanies(api) {
  const response = yield call(api.companies.getCompanies)

  if (response.ok && response.data.result === 'ok') {
    yield put(CompaniesCreators.getCompaniesSuccess(response.data.data))
  } else {
    yield put(CompaniesCreators.getCompaniesFailure())
  }
}

export default function* main(api) {
  yield all([takeLatest(CompaniesTypes.GET_COMPANIES_REQUEST, getCompanies, api)])
}
