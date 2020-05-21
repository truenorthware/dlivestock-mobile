import styled from 'styled-components/native'

import { Box } from '../Box'
import { Text as TextUI } from '../Text'

export const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

export const Text = styled(TextUI).attrs({
  numberOfLines: 1,
})`
  flex: 1;
`

export const IconContainer = styled(Box).attrs({
  ml: 3,
  size: 16,
})``
