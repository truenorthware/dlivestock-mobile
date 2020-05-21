import React from 'react'
import PT from 'prop-types'

import { Container, Icon, Label } from './styles'

const MainItem = ({ glyph, label, tintColor }) => (
  <Container>
    {glyph && <Icon glyph={glyph} tintColor={tintColor} />}
    <Label color={tintColor}>{label}</Label>
  </Container>
)

MainItem.propTypes = {
  glyph: Icon.propTypes.glyph,
  label: PT.string.isRequired,
  tintColor: PT.string.isRequired,
}

MainItem.defaultProps = {
  glyph: null,
}

export { MainItem }
