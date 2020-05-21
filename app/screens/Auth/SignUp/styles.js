import styled from 'styled-components/native'
import { space } from 'styled-system'

import { Link, Box, Text, Dropdown as DropdownUI, Text as TextUI } from 'components/ui'

export * from '../common/styles'
export { Loader } from 'components/ui'

export const LinkButton = styled(Link).attrs({
  textStyle: {
    textAlign: 'center',
  },
  fontFamilyStyle: 'styles.medium',
})`
  ${space}
`

export const Meta = styled(Box).attrs({
  mt: 5,
})`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

export const HasAccount = styled(Text).attrs(() => ({
  fontFamilyStyle: 'styles.medium',
  mr: 2,
}))``

export const Dropdown = styled(DropdownUI).attrs(props => ({
  mb: !props.isLast ? 6 : 4,
}))`
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
