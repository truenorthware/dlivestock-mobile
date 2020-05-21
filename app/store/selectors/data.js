import { createSelector } from 'reselect'

import curry from 'lodash/curry'

import { denormalize, mergeEntities } from 'utils/redux'

const getState = state => state.data

export const getData = createSelector(
  getState,
  state => mergeEntities(state.cache, state.entities),
)

export const getResource = curry((type, id) =>
  createSelector(
    getData,
    data => denormalize(data, type, id),
  ),
)

export const getResourceFromData = curry((type, data, id) => denormalize(data, type, id))
