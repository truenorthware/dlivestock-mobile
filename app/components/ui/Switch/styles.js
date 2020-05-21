import styled from 'styled-components/native'

import { mapToTheme, getColor } from 'theme'

import { Box } from '../Box'

export const getActiveColor = props => mapToTheme('switches.activeColor')(props)(props)(props)

export const getInactiveColor = getColor('silver')

export const Touchable = styled.TouchableWithoutFeedback``

export const Container = styled(Box).attrs({
  borderRadius: 16,
})`
  flex-direction: row;
`

export const Bubble = styled(Box)`
  position: absolute;
  top: 2;
  border-radius: ${props => props.size / 2};
`
