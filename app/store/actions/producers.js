import { createActions } from 'reduxsauce'

export const { Types: ProducersTypes, Creators: ProducersCreators } = createActions(
  {
    getProducersRequest: null,
    getProducersSuccess: ['producers'],
    getProducersFailure: null,
  },
  { prefix: 'Producers/' },
)
