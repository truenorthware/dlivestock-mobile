import styled from 'styled-components/native'
import { space } from 'styled-system'

import { getSpace } from 'theme/rules'

import { crossIcon } from 'images'

import {
  Dropdown as DropdownUI,
  Box as BoxUI,
  Button as ButtonUI,
  IconButton,
  Text as TextUI,
} from 'components/ui'

export { Loader, IconButton, TextAreaInput } from 'components/ui'

export * from 'screens/Auth/common/styles'

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

export const Meta = styled(BoxUI).attrs(() => ({
  py: 2,
}))`
  flex-direction: row;
`

export const Nvds = styled.ScrollView.attrs({
  horizontal: true,

  contentContainerStyle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  showsHorizontalScrollIndicator: false,
})``

export const Images = styled.View`
  margin-left: ${getSpace(2)};
  margin-right: ${getSpace(2)};
  padding-left: ${getSpace(4)};
  padding-right: ${getSpace(4)};
  width: 100;
  height: 100;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

export const Image = styled.Image`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  border-radius: ${getSpace(2)};
`

export const CloseButton = styled(IconButton).attrs({
  iconGlyph: crossIcon,
  iconTintColor: 'pinkSalmon',
  iconSize: 20,
})`
  position: absolute;
  top: ${getSpace(7)};
  right: ${getSpace(4)};
`

export const Button = styled(ButtonUI).attrs(props => ({
  mb: props.isLast ? null : 4,
}))`
  ${space}
`
