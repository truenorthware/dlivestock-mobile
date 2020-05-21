import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import { CompaniesCreators } from 'store/actions/companies'
import { FreightsCreators } from 'store/actions/freights'
import { ProducersCreators } from 'store/actions/producers'
import { TripsCreators } from 'store/actions/trips'
import { AppCreators } from 'store/actions/app'

import { user, getJWTHeader } from 'store/selectors/session'
import { companies } from 'store/selectors/companies'
import { freights } from 'store/selectors/freights'
import { producers } from 'store/selectors/producers'
import { trips } from 'store/selectors/trips'
import { isOpenedTripForm } from 'store/selectors/app'

import Component from './Lobby'

const SELECTOR = createStructuredSelector({
  user,
  getJWTHeader,
  companies,
  freights,
  producers,
  trips,
  isOpenedTripForm,
})

const ACTIONS = {
  onCreateTrip: TripsCreators.createTripRequest,
  onGetCompanies: CompaniesCreators.getCompaniesRequest,
  onGetFreights: FreightsCreators.getFreightsRequest,
  onGetProducers: ProducersCreators.getProducersRequest,
  onGetTrips: TripsCreators.getTripsRequest,
  onUpdateTrip: TripsCreators.updateTripRequest,
  onOpenTripForm: AppCreators.openTripForm,
}

export default connect(
  SELECTOR,
  ACTIONS,
)(Component)
