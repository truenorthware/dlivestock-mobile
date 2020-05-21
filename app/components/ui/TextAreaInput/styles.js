import styled, { css } from 'styled-components/native'
import { fontSize, space, color, borderRadius, borderColor } from 'styled-system'

import { getColor, fontFamilyComplex } from 'theme'

import { FieldError as FieldErrorUI } from '../FieldError'
import { FieldLabel as FieldLabelUI } from '../FieldLabel'

export const Container = styled.View``

export const Input = styled.TextInput.attrs(props => ({
  bg: props.editable ? 'white' : getColor('gallery')(props),
  color: 'tundora',
  selectionColor: getColor('deepBlue')(props),
  placeholderTextColor: getColor('silver')(props),
  px: 4,
  py: 3,
  borderRadius: 1,
  fontSize: 1,
  fontFamilyGroup: 'groups.montserrat',
  fontFamilyStyle: 'styles.regular',
}))`
  height: 100;
  border-width: 1;
  text-align-vertical: center;

  ${props =>
    css`
      border-color: ${getColor(props.isFocused ? 'deepBlue' : 'dustyGray')(props)};
    `}

  ${props =>
    props.hasError &&
    css`
      border-color: ${getColor('vividTangerine')(props)};
    `}

  ${space}
  ${color}
  ${fontSize}
  ${borderRadius}
  ${borderColor}
  ${fontFamilyComplex}
`

export const FieldLabel = styled(FieldLabelUI).attrs({ mb: 3 })`
  ${space}
`

export const FieldError = styled(FieldErrorUI)`
  position: absolute;
  bottom: -22;
`
