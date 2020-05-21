import get from 'lodash/get'
import mergeWith from 'lodash/mergeWith'

import { latestArrayMerger } from 'utils/mergers'

import { AppTypes } from 'store/actions/app'
import { AuthTypes } from 'store/actions/auth'
import { TripsTypes } from 'store/actions/trips'

const INITIAL_STATE = []

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TripsTypes.GET_TRIPS_SUCCESS:
      return mergeWith([], state, get(action, 'trips'), latestArrayMerger)

    case TripsTypes.CREATE_TRIP_SUCCESS:
      return [...state, get(action, 'trip')]

    case TripsTypes.UPDATE_TRIP_SUCCESS: {
      const trip = get(action, 'trip')
      return state.map(item => {
        if (item.id === trip.id) return trip
        return item
      })
    }

    case AuthTypes.LOG_OUT_SUCCESS:
    case AppTypes.REFRESH:
      return INITIAL_STATE

    default:
      return state
  }
}
