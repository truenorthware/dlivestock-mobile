import Immutable from 'seamless-immutable'

import get from 'lodash/get'
import pick from 'lodash/pick'

import { createReducer } from 'utils/redux'

import { AppTypes } from 'store/actions/app'
import { AuthTypes } from 'store/actions/auth'

export const INITIAL_STATE = Immutable({
  isRehydrated: false,
  isRefetched: false,
  openTripForm: false,
  openDrawer: false,
})

const completeRefetch = state => state.merge({ isRefetched: true })
const completeRehydration = state => state.merge({ isRehydrated: true })
const handleTripForm = state => state.merge({ openTripForm: !get(state, 'openTripForm') })
const handleDrawer = (state, action) => {
  const status = get(action, 'status', null)
  return state.merge({ openDrawer: status === null ? !get(state, 'openDrawer') : status })
}

export const HANDLERS = {
  [AppTypes.COMPLETE_REFETCH]: completeRefetch,
  [AppTypes.COMPLETE_REHYDRATION]: completeRehydration,
  [AppTypes.OPEN_TRIP_FORM]: handleTripForm,
  [AppTypes.OPEN_DRAWER]: handleDrawer,
}

const resetFn = (state, initialState) => initialState.merge(pick(state, 'isRehydrated'))

export default createReducer(INITIAL_STATE, HANDLERS, {
  resetFn,
  resetOn: [AuthTypes.LOG_OUT_SUCCESS],
})
