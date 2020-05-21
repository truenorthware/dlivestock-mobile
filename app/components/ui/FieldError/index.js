import React from 'react'
import { ViewPropTypes } from 'react-native'

import isArray from 'lodash/isArray'

import { FinalFormPropTypes } from 'constants/propTypes'

import { Container, Text } from './styles'

const FieldError = ({ meta, style }) => {
  if (FieldError.hasError(meta)) {
    return (
      <Container style={style}>
        <Text>{isArray(meta.error) ? meta.error[0] : meta.error}</Text>
      </Container>
    )
  }

  return null
}

FieldError.propTypes = {
  meta: FinalFormPropTypes.meta.isRequired,
  style: ViewPropTypes.style,
}

FieldError.defaultProps = {
  style: {},
}

FieldError.hasError = meta =>
  meta.touched && (meta.error || (meta.submitError && !meta.dirtySinceLastSubmit))

export { FieldError }
