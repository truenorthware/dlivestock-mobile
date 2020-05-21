import { createSelector } from 'reselect'

const getState = state => state.theme

export const getCurrentTheme = createSelector(
  getState,
  state => state.theme,
)
