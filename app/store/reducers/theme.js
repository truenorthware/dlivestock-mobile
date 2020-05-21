import Immutable from 'seamless-immutable'

import { createReducer } from 'utils/redux'

import appConfig from 'config/app'

import { ThemeTypes } from 'store/actions/theme'

const INITIAL_STATE = Immutable({
  theme: appConfig.appearance.theme,
})

const switchTheme = (state, { theme }) => state.merge({ theme })

const HANDLERS = {
  [ThemeTypes.SWITCH_THEME]: switchTheme,
}

export default createReducer(INITIAL_STATE, HANDLERS)
