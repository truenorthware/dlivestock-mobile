import isFunction from 'lodash/isFunction'
import isNil from 'lodash/isNil'
import isString from 'lodash/isString'
import toLower from 'lodash/toLower'

const safeFormat = (validate, formatter, defaultValue) => value => {
  const valid = isFunction(validate) ? validate(value) : true

  if (valid) {
    return formatter(value)
  }

  return isNil(defaultValue) ? value : defaultValue
}

const lowerCase = toLower

const round = value => Math.round(value, 10)

const integer = safeFormat(
  isString,
  value => value.replace(/[^0-9]/g, '').replace(/(\..*)\./g, '$1'),
  '',
)

const float = safeFormat(
  isString,
  value => value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'),
  '',
)

const phone = value => (value ? `+${value}` : '')

export default {
  float,
  integer,
  lowerCase,
  round,
  phone,
}
