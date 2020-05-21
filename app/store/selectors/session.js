import { createSelector } from 'reselect'

import get from 'lodash/get'
import pick from 'lodash/pick'

import { UserTypes } from 'services/dataTypes'

const getState = state => state.session

export const user = createSelector(
  getState,
  state => {
    if (!state.user) return state.user
    const properties = state.user.properties.map(property => ({
      ...pick(property, ['name', 'pic']),
      id: property.id.toString(),
      location: property.position.coordinates,
    }))
    return {
      ...state.user,
      properties,
    }
  },
)

export const userType = createSelector(
  getState,
  state => get(state, 'user.type', UserTypes.Producer),
)

export const getJWTToken = createSelector(
  getState,
  state => state.accessToken,
)

export const getJWTHeader = createSelector(
  getJWTToken,
  token => (token ? `Bearer ${token}` : null),
)

export const isAuthenticated = createSelector(
  getJWTToken,
  token => token !== null,
)
