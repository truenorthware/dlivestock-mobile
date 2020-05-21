import React from 'react'
import PT from 'prop-types'

import { Container, StatusBar } from './styles'

const Simple = ({ bg, ...props }) => (
  <Container bg={bg}>
    <StatusBar barStyle="dark-content" bg={bg} {...props} />
  </Container>
)

Simple.propTypes = {
  bg: PT.string,
}

Simple.defaultProps = {
  bg: 'white',
}

export { Simple }
