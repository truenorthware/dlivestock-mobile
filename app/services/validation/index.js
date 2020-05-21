import v from 'validate.js'

import curry from 'lodash/curry'

import ownValidators from './validators'

import formatSchemas from './schemas/format'
import constraintsSchemas from './schemas/constraints'

const schemas = {
  format: formatSchemas,
  constraints: constraintsSchemas,
}

const validators = {
  predefined: v.validators,
  own: ownValidators,
}

v.validators = { ...validators.predefined, ...validators.own }

const validate = curry((constraints, attributes) => v(attributes, constraints))

export default {
  schemas,
  validators,
  validate,
}
