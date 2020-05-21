import styled from 'styled-components/native'
import { size, color, space, borderColor, borderRadius, width, height } from 'styled-system'

import { shadow, borderCornerRadius } from 'theme'

const Box = styled.View`
  ${size}
  ${color}
  ${space}
  ${shadow}
  ${width}
  ${height}
  ${borderColor}
  ${borderRadius}
  ${borderCornerRadius}
`

export { Box }
