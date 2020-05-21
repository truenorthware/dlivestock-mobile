import styled from 'styled-components/native'
import { space, width, borderRadius } from 'styled-system'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { getMetrics, getSpace } from 'theme'

import { Box, Text as TextUI, Button as ButtonUI, TextInput as TextInputUI } from 'components/ui'

export const Container = styled(Box).attrs(props => ({
  bg: 'white',
  pb: getMetrics('bottomSpace')(props),
}))`
  flex: 1;
`

export const Scrollable = styled(KeyboardAwareScrollView).attrs(props => ({
  keyboardShouldPersistTaps: 'handled',

  contentContainerStyle: {
    minHeight: '100%',
    maxWidth: '100%',
    padding: getSpace(5)(props),
  },
}))`
  flex: 1;
`

export const TextInput = styled(TextInputUI).attrs(props => ({
  mb: props.isLast ? null : 6,
}))`
  ${space}
`

export const FormInner = styled.View`
  flex: 1;
`

export const FormContent = styled.View`
  flex: 1;
`

export const FormFooter = styled(Box).attrs({
  mt: 4,
})``

export const CenterContent = styled.View.attrs(props => ({
  mt: getSpace(2)(props),
}))`
  flex: 1;
`

export const Text = TextUI
export const Button = styled(ButtonUI).attrs(props => ({
  mb: props.isLast ? null : 4,
  mx: 'auto',
}))`
  ${space}
  ${width}
  ${borderRadius}
`
