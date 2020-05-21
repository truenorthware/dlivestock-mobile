import { createActions } from 'reduxsauce'

export const { Types: FreightsTypes, Creators: FreightsCreators } = createActions(
  {
    getFreightsRequest: ['resolve', 'reject'],
    getFreightsSuccess: ['freights'],
    getFreightsFailure: null,
  },
  { prefix: 'Freights/' },
)
