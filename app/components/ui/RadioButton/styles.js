import styled, { css } from 'styled-components/native'

import { mapToTheme } from 'theme'

import { Box } from '../Box'
import { Text as TextUI } from '../Text'

export const Container = styled.TouchableOpacity.attrs({
  activeOpacity: 0.6,
})`
  flex-direction: row;
  align-items: center;
`

export const Icon = styled(Box).attrs(props => ({
  size: 24,
  borderRadius: 12,
  borderWidth: props.isChecked ? 4 : 0,
  bg: props.isChecked ? 'white' : 'silver',
}))`
  ${props => props.isChecked && mapToTheme('radioButtons.icon__isChecked')}
  ${props => props.isDisabled && mapToTheme('radioButtons.icon__isDisabled')}

  ${props =>
    props.isDisabled && props.isChecked && mapToTheme('radioButtons.icon__isDisabled__isChecked')}
`

export const Label = styled(TextUI).attrs({
  ml: 3,
  numberOfLines: 1,
})`
  ${props =>
    props.isVertical &&
    css`
      flex: 1;
    `}
`
