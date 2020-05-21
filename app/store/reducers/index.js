import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'

import reduxPersistConfig from 'config/reduxPersist'

import app from './app'
import data from './data'
import companies from './companies'
import producers from './producers'
import freights from './freights'
import session from './session'
import trips from './trips'
import theme from './theme'

export default combineReducers({
  data: persistReducer(reduxPersistConfig.dataConfig, data),

  app,
  companies,
  producers,
  freights,
  session,
  trips,
  theme,
})
