import { connect } from 'react-redux'

import { TripsCreators } from 'store/actions/trips'

import Component from './Detail'

const ACTIONS = {
  onGetTrip: TripsCreators.getTripRequest,
}

export default connect(
  null,
  ACTIONS,
)(Component)
