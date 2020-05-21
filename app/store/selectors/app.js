import { createSelector } from 'reselect'

import { isAuthenticated } from './session'

const getState = state => state.app

export const isRehydrated = createSelector(
  getState,
  state => state.isRehydrated,
)

export const isRefetched = createSelector(
  getState,
  state => state.isRefetched,
)

export const isOpenedTripForm = createSelector(
  getState,
  state => state.openTripForm,
)

export const isOpenedDrawer = createSelector(
  getState,
  state => state.openDrawer,
)

export const isRestored = createSelector(
  isRehydrated,
  isAuthenticated,
  isRefetched,
  (rehydrated, authenticated, refetched) => {
    if (rehydrated) return authenticated ? refetched : true
    return false
  },
)
