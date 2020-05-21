import styled from 'styled-components/native'
import { size, color, space, borderColor, borderRadius, width, height } from 'styled-system'

import { Text as TextUI } from '../Text'
import { Box } from '../Box'

export const Container = styled(Box).attrs({})``

export const Touchable = styled.TouchableWithoutFeedback`
  ${size}
  ${color}
  ${space}
  ${width}
  ${height}
  ${borderColor}
  ${borderRadius}
`

export const Text = styled(TextUI).attrs({
  fontFamilyStyle: 'styles.semiBold',
  py: 2,
})`
  text-align: center;
`
