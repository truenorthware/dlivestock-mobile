import get from 'lodash/get'
import isNaN from 'lodash/isNaN'
import isNumber from 'lodash/isNumber'
import isString from 'lodash/isString'
import map from 'lodash/map'
import merge from 'lodash/merge'
import reduce from 'lodash/reduce'

export const createOption = dirtyConfig => data => {
  const DEFAULT_CONFIG = {
    getValue: o => o.id || o.value || o,
    getLabel: o => o.name || o.label || o,
    getExtendedLabel: o => o.name || o.label || o,
  }

  const config = merge({}, DEFAULT_CONFIG, dirtyConfig)

  return {
    value: config.getValue(data),
    label: config.getLabel(data),
    extendedLabel: config.getExtendedLabel(data),
  }
}

export const createOptions = (items, config = {}) => map(items, createOption(config))

export const getValue = (subject, field, fallback = null) =>
  get(subject, `${field}.id`) || get(subject, field) || fallback

export const getValueOrFirstOption = (subject, options, field, fallback = null) =>
  getValue(subject, field) || getValue(options, '0') || fallback

export const getSafeNumber = (value, fallback = null) => Number(value) || fallback

export const getSafeString = (value, fallback = null) => {
  if (!isNaN(value) && isNumber(value)) {
    return value.toString()
  }

  if (isString(value)) {
    return value
  }

  return fallback
}

export const nullifyFields = list => reduce(list, (acc, field) => ({ ...acc, [field]: null }), {})
