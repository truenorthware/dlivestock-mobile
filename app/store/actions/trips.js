import { createActions } from 'reduxsauce'

export const { Types: TripsTypes, Creators: TripsCreators } = createActions(
  {
    getTripsRequest: ['resolve', 'reject'],
    getTripsSuccess: ['trips'],
    getTripsFailure: null,

    getTripRequest: ['tripId', 'resolve', 'reject'],

    createTripRequest: ['payload', 'resolve', 'reject'],
    createTripSuccess: ['trip'],

    updateTripRequest: ['payload', 'resolve', 'reject'],
    updateTripSuccess: ['trip'],
  },
  { prefix: 'Trips/' },
)
