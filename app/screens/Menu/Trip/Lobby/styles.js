import styled from 'styled-components/native'
import { space, color, width, height } from 'styled-system'

import { getColor, getSpace } from 'theme/rules'

import { crossIcon } from 'images'

import {
  Box as BoxUI,
  Dropdown as DropdownUI,
  Icon as IconUI,
  IconButton,
  Button as ButtonUI,
  Text as TextUI,
  Link as LinkUI,
} from 'components/ui'

export { Loader, IconButton, Modal } from 'components/ui'

export * from 'screens/Auth/common/styles'

export const Dropdown = styled(DropdownUI).attrs(props => ({
  mb: !props.isLast ? 6 : 4,
}))`
  ${space}
`

export const MoreButton = styled(LinkUI)`
  margin: 24px auto;
`

export const ActiveTripList = styled.FlatList.attrs({
  contentContainerStyle: {
    flex: 1,
    flexGrow: 1,
  },
})`
  flex: 1;
  margin: -20px;
`

export const TripContent = styled(BoxUI).attrs({
  p: 5,
  backgroundColor: 'white',

  shadowOpacity: 0.5,
  shadowRadius: 10,
  elevation: 15,
})`
  margin: 5px 20px 0 20px;
  height: 405px;
  ${space}
  ${height}
`

export const Meta = styled(BoxUI)`
  flex-direction: row;
  align-items: center;
  ${space}
`

export const MetaText = styled.View`
  flex-direction: row;
`

export const MetaIconView = styled(BoxUI).attrs(props => ({
  bg: '#d9eeff',
  mr: 4,
  px: 4,
  pt: props.isFirst ? 5 : 3,
  pb: props.isLast ? 5 : 3,
  borderTopLeftRadius: props.isFirst ? 50 : 0,
  borderTopRightRadius: props.isFirst ? 50 : 0,
  borderBottomLeftRadius: props.isLast ? 50 : 0,
  borderBottomRightRadius: props.isLast ? 50 : 0,
}))``

export const MetaButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`

export const Actions = styled(BoxUI).attrs({
  mt: 3,
})`
  justify-content: space-between;
  flex-direction: row;
  ${space}
  ${width}
`

export const Flex0 = styled.View`
  flex-grow: 0;
  ${space}
`

export const Flex1 = styled.ScrollView`
  flex-grow: 1;
  ${space}
`

export const Icon = styled(IconUI).attrs(props => ({
  size: getSpace(4)(props),
  tintColor: 'deepBlue',
}))``

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

export const NoTrips = styled.View`
  align-items: center;
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

export const Input = styled.TextInput.attrs(props => ({
  bg: 'white',
  color: 'tundora',
  selectionColor: getColor('deepBlue')(props),
  placeholderTextColor: getColor('silver')(props),
  numberOfLines: 0,
  paddingHorizontal: 8,
  borderRadius: 1,
  borderColor: getColor('dustyGray')(props),
  fontFamilyGroup: 'groups.montserrat',
  fontFamilyStyle: 'styles.regular',
}))`
  height: 100;
  border-width: 1;
  ${color}
`

export const Button = styled(ButtonUI).attrs(props => ({
  mb: props.isLast ? null : 4,
}))`
  width: 49%;
  ${space}
  ${width}
`

export const DatePickerWrapper = styled(BoxUI).attrs({
  px: 4,
  py: 2,
  mb: 6,
  backgroundColor: 'white',

  shadowOpacity: 0.5,
  shadowRadius: 10,
  elevation: 15,
})``
