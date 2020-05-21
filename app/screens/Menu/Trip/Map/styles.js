import styled from 'styled-components/native'
import { color, space, width } from 'styled-system'

import MapViewUI, { Marker } from 'react-native-maps'

import { getMetrics, getColor, getSpace } from 'theme'

import { Box as BoxUI, IconButton, Icon, Button as ButtonUI } from 'components/ui'
import { ListSheet } from 'components/blocks'

import { markerDesIcon, markerOrgIcon, markerUserIcon, menuIcon, spritIcon } from 'images'

export { Modal } from 'components/ui'

export const Button = styled(ButtonUI)`
  ${width}
  ${space}
`

export const Container = styled(BoxUI).attrs({
  p: 3,
})`
  flex: 1;
`

export const MapUtil = styled(BoxUI).attrs(props => ({
  width: 44,
  height: 44,
  mt: getMetrics('statusBarHeight')(props),
  shadow: 'button',
  backgroundColor: 'white',
}))`
  border-radius: 50;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

export const MenuButton = styled(IconButton).attrs({
  iconGlyph: menuIcon,
  iconTintColor: 'black',
  iconSize: 20,
})``

export const MapView = styled(MapViewUI)`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`

export const MarkerOrigin = styled(Marker).attrs({
  image: markerOrgIcon,
})``

export const MarkerDestination = styled(Marker).attrs({
  image: markerDesIcon,
})``

export const AnimateMarker = styled(Marker.Animated).attrs(props => ({
  image: markerUserIcon,
  anchor: { x: 0.5, y: 0.5 },
  rotation: props.heading,
}))``

export const SpritIcon = styled(Icon).attrs({
  glyph: spritIcon,
  tintColor: 'black',
  size: 20,
})``

export const SpritButton = styled(Button)`
  position: absolute;
  right: ${getSpace(5)};
  bottom: ${getSpace(8)};
  border-radius: 50;
  height: 40px;
  width: 40px;
`

export const Meta = styled(BoxUI).attrs(() => ({
  py: 2,
}))`
  flex-direction: row;
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

export const Sheet = ListSheet
