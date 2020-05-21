import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import { getJWTHeader } from 'store/selectors/session'
import { companies } from 'store/selectors/companies'
import { producers } from 'store/selectors/producers'
import { trips } from 'store/selectors/trips'

import { TripsCreators } from 'store/actions/trips'

import Component from './Map'

const SELECTOR = createStructuredSelector({
  getJWTHeader,
  companies,
  producers,
  trips,
})

const ACTIONS = {
  onUpdateTrip: TripsCreators.updateTripRequest,
}

export default connect(
  SELECTOR,
  ACTIONS,
)(Component)
