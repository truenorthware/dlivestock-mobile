import { createActions } from 'reduxsauce'

export const { Types: CompaniesTypes, Creators: CompaniesCreators } = createActions(
  {
    getCompaniesRequest: null,
    getCompaniesSuccess: ['companies'],
    getCompaniesFailure: null,
  },
  { prefix: 'Companies/' },
)
