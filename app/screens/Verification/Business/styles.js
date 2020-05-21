import styled from 'styled-components/native'
import { space } from 'styled-system'

import {
  Box as BoxUI,
  Dropdown as DropdownUI,
  DropdownMultiple as DropdownMultipleUI,
  TextButton as TextButtonUI,
  Text as TextUI,
} from 'components/ui'

export * from '../../Auth/common/styles'

export const TextButton = styled(TextButtonUI).attrs({
  mb: 5,
})``

export const Meta = styled(BoxUI)`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

export const Box = BoxUI

export const Dropdown = styled(DropdownUI).attrs(props => ({
  mb: !props.isLast ? 6 : 4,
}))`
  ${space}
`

export const DropdownMultiple = styled(DropdownMultipleUI).attrs({
  mb: 6,
})`
  ${space}
`

export const Label = styled(TextUI)`
  font-weight: 900;
  margin-left: -40px;
  margin-right: -40px;
  margin-bottom: 24px;
  padding: 20px 40px;
  background-color: #fafafa;
  color: #8b8c8e;
  border-color: #ededed;
  border-top-width: 1px;
  border-bottom-width: 1px;
  ${space}
`

export const Separator = styled.View`
  flex: 1;
  margin-top: -10px;
  margin-bottom: 20px;
  margin-left: -40px;
  margin-right: -40px;
  border-bottom-width: 1;
  border-bottom-color: #ededed;
  opacity: 0.7;
`
