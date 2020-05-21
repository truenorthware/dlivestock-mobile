import React from 'react'
import { ThemeProvider } from 'styled-components/native'
import PT from 'prop-types'

import { Base } from './styles'

const Provider = ({ theme, ...baseProps }) => (
  <ThemeProvider theme={theme}>
    <Base {...baseProps} />
  </ThemeProvider>
)

Provider.propTypes = {
  theme: PT.object.isRequired,
}

export default Provider
