import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import { CompaniesCreators } from 'store/actions/companies'
import { ProducersCreators } from 'store/actions/producers'
import { TripsCreators } from 'store/actions/trips'
import { AppCreators } from 'store/actions/app'

import { isOpenedDrawer } from 'store/selectors/app'
import { getJWTHeader } from 'store/selectors/session'
import { companies } from 'store/selectors/companies'
import { producers } from 'store/selectors/producers'
import { trips } from 'store/selectors/trips'

import Component from './ViewMap'

const SELECTOR = createStructuredSelector({
  isOpenedDrawer,
  getJWTHeader,
  companies,
  producers,
  trips,
})

const ACTIONS = {
  onCreateTrip: TripsCreators.createTripRequest,
  onGetCompanies: CompaniesCreators.getCompaniesRequest,
  onGetProducers: ProducersCreators.getProducersRequest,
  onOpenDrawer: AppCreators.openDrawer,
}

export default connect(
  SELECTOR,
  ACTIONS,
)(Component)
