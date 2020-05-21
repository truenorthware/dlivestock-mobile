import styled from 'styled-components/native'
import { space } from 'styled-system'

import { Dropdown as DropdownUI, Text as TextUI } from 'components/ui'

export * from 'screens/Auth/common/styles'

export const Dropdown = styled(DropdownUI).attrs(props => ({
  mb: !props.isLast ? 6 : 4,
}))`
  ${space}
`

export const Label = styled(TextUI)`
  font-weight: 900;
  margin: -24px -40px 24px -40px;
  padding: 20px 40px;
  background-color: #fafafa;
  color: #8b8c8e;
`
