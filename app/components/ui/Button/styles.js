import styled, { css } from 'styled-components/native'
import LinearGradient from 'react-native-linear-gradient'

import { mapToTheme, getColor } from 'theme'

import { Box } from '../Box'
import { Text as TextUI } from '../Text'

export const Touchable = styled.TouchableWithoutFeedback``

export const Container = styled(LinearGradient).attrs(props => ({
  colors:
    props.variant === 'secondary'
      ? [getColor('lightRed')(props), getColor('deepRed')(props)]
      : [getColor('lightBlue')(props), getColor('deepBlue')(props)],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
  shadow: props.isPressed ? 'button' : 'normal',
}))`
  height: 55;
  min-width: 40;
  overflow: hidden;

  ${mapToTheme('buttons.container')}

  ${props => props.isPressed && mapToTheme('buttons.container__isPressed')}

  ${props =>
    props.isDisabled &&
    css`
      background-color: ${getColor('gallery')};
    `}
`

export const OverlayBackground = styled(Box).attrs(props => ({
  px: props.title ? 5 : 0,
}))`
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: row;

  ${mapToTheme('buttons.container')}
`

export const Text = styled(TextUI).attrs({
  color: 'white',
  fontFamilyStyle: 'styles.semiBold',
})`
  width: 100%;
  text-align: center;

  ${mapToTheme('buttons.text')}
`
