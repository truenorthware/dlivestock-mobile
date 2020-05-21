import React from 'react'
import PT from 'prop-types'

import { Image } from '../Image'
import { Container } from './styles'

const Icon = ({ glyph, ...restProps }) => <Container {...restProps} source={glyph} />

Icon.propTypes = {
  ...Image.propTypes,
  glyph: Image.propTypes.source.isRequired,
  size: PT.oneOfType([PT.object, PT.number]),
}

Icon.defaultProps = {
  size: null,
}

export { Icon }
