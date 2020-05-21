import styled from 'styled-components/native'
import { space } from 'styled-system'

import MapViewUI, { Marker } from 'react-native-maps'

import { getSpace, getMetrics } from 'theme'

import { Box, Icon as IconUI } from 'components/ui'

import { markerDesIcon, markerOrgIcon, markerUserIcon } from 'images'

export { Loader, Text, Br } from 'components/ui'

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

export const MapView = styled(MapViewUI).attrs(props => ({
  height: getMetrics('screenWidth')(props),
}))``

export const MarkerOrigin = styled(Marker).attrs({
  image: markerOrgIcon,
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
