import styled from 'styled-components/native'
import { space } from 'styled-system'

import { getColor } from 'theme'

import { dropDownIcon } from 'images'

import { ListSheet } from 'components/blocks'
import { Box } from '../Box'
import { FieldError as FieldErrorUI } from '../FieldError'
import { FieldLabel as FieldLabelUI } from '../FieldLabel'
import { Icon } from '../Icon'
import { Text } from '../Text'

export const Container = styled.View``

export const Picker = styled.TouchableWithoutFeedback``

export const PickerContent = styled(Box).attrs(props => ({
  bg: props.disabled ? getColor('gallery')(props) : 'white',
  px: 4,
  borderRadius: 1,
  borderColor: props.hasError ? 'vividTangerine' : 'dustyGray',
}))`
  height: 40;
  flex-direction: row;
  align-items: center;
  border-width: 1;
`

export const PickerArrow = styled(Box).attrs({
  ml: 4,
})`
  align-items: center;
  justify-content: center;
`

export const PickerArrowIcon = styled(Icon).attrs(props => ({
  glyph: dropDownIcon,
  tintColor: props.hasError ? 'vividTangerine' : 'black',
}))``

export const PickerValue = styled(Text).attrs(props => ({
  numberOfLines: 1,
  color: props.isPlaceholder ? 'silver' : 'tundora',
}))`
  flex: 1;
`

export const PickerValueMissing = styled.View`
  flex: 1;
`

export const FieldLabel = styled(FieldLabelUI).attrs({ mb: 3 })`
  ${space}
`

export const FieldError = styled(FieldErrorUI)`
  position: absolute;
  bottom: -22;
`

export const Sheet = ListSheet
