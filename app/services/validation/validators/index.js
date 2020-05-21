/* eslint no-param-reassign: 0, consistent-return: 0 */

import v from 'validate.js'

const passwordConfirmation = (value, options, key, attributes) => {
  if (attributes && value !== attributes.password) {
    return 'should match password'
  }

  return null
}

const notEqualTo = (value, options, attribute, attributes, globalOptions) => {
  if (!v.isDefined(value)) {
    return
  }

  if (!v.isString(options)) {
    return
  }

  options = { attribute: options }

  const message = options.message || 'is equal to %{attribute}'

  const otherValue = v.getDeepObjectValue(attributes, options.attribute)
  const comparator = options.comparator || ((v1, v2) => v1 !== v2)
  const prettify = options.prettify || (globalOptions && globalOptions.prettify) || v.prettify

  if (!comparator(value, otherValue, options, attribute, attributes)) {
    return v.format(message, { attribute: prettify(options.attribute) })
  }
}

export default {
  notEqualTo,
  passwordConfirmation,
}
