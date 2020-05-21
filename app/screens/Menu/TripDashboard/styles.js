import styled from 'styled-components/native'
import { space } from 'styled-system'

import MapViewUI, { Marker } from 'react-native-maps'
import DrawerUI from 'react-native-drawer'

import { getSpace, getMetrics } from 'theme'

import { Box, Icon as IconUI } from 'components/ui'

import { markerDesIcon, markerOrgIcon, markerUserIcon, markerTruckIcon, locationIcon } from 'images'

export { Modal, Loader, Text, Br } from 'components/ui'

export * from 'screens/Auth/common/styles'

export const Container = styled(Box).attrs({})`
  flex: 1;
`

export const WhiteBg = styled(Box).attrs({})`
  background-color: #fff;
  margin-top: -30px;
  padding: 20px 10px;
`

export const Scrollable = styled.ScrollView.attrs(props => ({
  keyboardShouldPersistTaps: 'handled',

  contentContainerStyle: {
    paddingHorizontal: getSpace(5)(props),
    paddingTop: getSpace(5)(props),
    paddingBottom: getMetrics('bottomSpace')(props),
  },
}))`
  margin-top: -30px;
`

export const MapView = styled(MapViewUI)`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`

export const MarkerOrigin = styled(Marker).attrs({
  image: markerTruckIcon,
})``

export const MarkerDestination = styled(Marker).attrs({
  image: markerDesIcon,
})``

export const MarkerDriver = styled(Marker).attrs({
  image: markerUserIcon,
})``

export const Meta = styled(Box)`
  flex-direction: row;
  align-items: center;
  ${space}
`

export const MetaIconView = styled(Box).attrs(props => ({
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

export const Icon = styled(IconUI).attrs(props => ({
  size: getSpace(4)(props),
  tintColor: 'deepBlue',
}))``

export const Drawer = styled(DrawerUI).attrs({
  type: 'overlay',
  openDrawerOffset: 0.4,
  panCloseMask: 0.2,
  side: 'right',

  styles: {
    drawer: {
      shadowColor: '#000000',
      shadowOpacity: 0.8,
      shadowRadius: 3,
      backgroundColor: 'white',
    },
    mainOverlay: { backgroundColor: 'white', opacity: 0 },
  },
})``

export const Flex1 = styled.ScrollView`
  flex-grow: 1;
  ${space}
`

export const DrawerItem = styled(Box).attrs({
  p: 4,
  mx: 4,
  mt: 4,
  backgroundColor: 'white',

  shadowOpacity: 0.5,
  shadowRadius: 10,
  elevation: 15,
})`
  flex-direction: row;
`
