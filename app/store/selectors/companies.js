import { createSelector } from 'reselect'

export const getState = state => state.companies

export const companies = createSelector(
  getState,
  state =>
    state.map(company => ({
      ...company,
      value: company.id.toString(),
      label: company.name,
      extendedLabel: company.name,
    })),
)
