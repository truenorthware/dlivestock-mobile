import styled, { css } from 'styled-components/native'

import { mapToTheme, getColor } from 'theme'
import { checkIcon } from 'images'

import { Box } from '../Box'
import { Icon as IconUI } from '../Icon'
import { Text as TextUI } from '../Text'

export const Container = styled.TouchableOpacity.attrs({
  activeOpacity: 0.6,
})``

export const IconContainer = styled(Box).attrs(props => ({
  size: 24,
  borderWidth: props.isChecked ? 0 : 2,
  borderRadius: 1,
  bg: 'white',
}))`
  align-items: center;
  justify-content: center;

  ${mapToTheme('checkboxes.iconContainer')};

  ${props => props.isChecked && mapToTheme('checkboxes.iconContainer__isChecked')}

  ${props =>
    props.isDisabled &&
    css`
      border-color: ${getColor('gallery')};
      background-color: ${getColor('gallery')};
    `}
`

export const Icon = styled(IconUI).attrs({
  glyph: checkIcon,
  tintColor: 'white',
})``

export const Label = styled(TextUI).attrs({
  ml: 3,
})``
