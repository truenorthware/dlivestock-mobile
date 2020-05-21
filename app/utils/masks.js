import identity from 'lodash/identity'

import { removeNotNumbers } from './string'

export const usPhoneNumber = {
  options: {
    mask: '(999) 999-9999',
    getRawValue: removeNotNumbers,
  },
  normalizeValue: value => `1${value}`,
}

export const ssn = {
  options: {
    mask: '999-99-9999',
    getRawValue: removeNotNumbers,
  },
  normalizeValue: identity,
}
