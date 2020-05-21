import { createActions } from 'reduxsauce'

export const { Types: AppTypes, Creators: AppCreators } = createActions(
  {
    refresh: null,
    startup: null,
    completeRefetch: null,
    completeRehydration: null,
    openTripForm: null,
    openDrawer: ['status'],
  },
  { prefix: 'App/' },
)
