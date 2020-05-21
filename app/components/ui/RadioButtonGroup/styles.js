import styled from 'styled-components/native'
import { space } from 'styled-system'

import { FieldError as FieldErrorUI } from '../FieldError'
import { FieldLabel as FieldLabelUI } from '../FieldLabel'
import { RadioButton as RadioButtonUI } from '../RadioButton'

export const Container = styled.View``

export const ButtonList = styled.View`
  width: 100%;
  flex-direction: ${props => (props.isVertical ? 'column' : 'row')};
  flex-wrap: wrap;
`

export const FieldLabel = styled(FieldLabelUI).attrs({ mb: 3 })`
  ${space}
`

export const FieldError = styled(FieldErrorUI)`
  position: absolute;
  bottom: -22;
`

export const RadioButton = styled(RadioButtonUI).attrs(props => {
  if (props.isFirst) return null

  return props.isVertical ? { mt: props.gap } : { ml: props.gap }
})`
  ${space}
`
