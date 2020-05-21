import get from 'lodash/get'
import mergeWith from 'lodash/mergeWith'

import { latestArrayMerger } from 'utils/mergers'

import { AppTypes } from 'store/actions/app'
import { AuthTypes } from 'store/actions/auth'

const INITIAL_STATE = []

export default (state = INITIAL_STATE, action) => {
  const companies = get(action, 'companies')

  if (companies) {
    return mergeWith([], state, companies, latestArrayMerger)
  }

  if (action.type === AuthTypes.LOG_OUT_SUCCESS || action.type === AppTypes.REFRESH) {
    return INITIAL_STATE
  }

  return state
}
