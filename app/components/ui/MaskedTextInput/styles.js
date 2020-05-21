import styled from 'styled-components/native'

import { space } from 'styled-system'

import { FieldError as FieldErrorUI } from '../FieldError'
import { FieldLabel as FieldLabelUI } from '../FieldLabel'
import { Input as InputSource } from '../TextInput/styles'

export const Container = styled.View``

export const Input = InputSource

export const FieldLabel = styled(FieldLabelUI).attrs({ mb: 3 })`
  ${space}
`

export const FieldError = styled(FieldErrorUI)`
  position: absolute;
  bottom: -22;
`
