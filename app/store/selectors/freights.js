import { createSelector } from 'reselect'

export const getState = state => state.freights

export const freights = createSelector(
  getState,
  state =>
    state.map(freight => ({
      ...freight,
      value: freight.id.toString(),
      label: freight.name,
      extendedLabel: freight.name,
    })),
)
