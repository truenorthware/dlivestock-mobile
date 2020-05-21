import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import { TripsCreators } from 'store/actions/trips'

import { companies } from 'store/selectors/companies'
import { producers } from 'store/selectors/producers'
import { trips } from 'store/selectors/trips'
import { user } from 'store/selectors/session'

import Component from './Edit'

const SELECTOR = createStructuredSelector({
  companies,
  producers,
  trips,
  user,
})

const ACTIONS = {
  onUpdateTrip: TripsCreators.updateTripRequest,
}

export default connect(
  SELECTOR,
  ACTIONS,
)(Component)
