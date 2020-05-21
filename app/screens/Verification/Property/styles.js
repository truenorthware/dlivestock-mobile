import styled from 'styled-components/native'
import { space } from 'styled-system'

import { getMetrics, getSpace, getColor } from 'theme'

import MapViewUI from 'react-native-maps'
import {
  Box as BoxUI,
  TextButton as TextButtonUI,
  Text,
  IconButton as IconButtonUI,
} from 'components/ui'

export * from '../../Auth/common/styles'

export const Row = styled(BoxUI)`
  flex-direction: row;
  align-items: flex-end;
  justify-content: center;
`

export const Box = styled.View`
  position: absolute;
  z-index: 999;
  right: -15;
`

export const PropertyView = styled.View`
  flex: 1;
`

export const MapView = styled(MapViewUI).attrs(props => ({
  height: getMetrics('screenWidth')(props) - 2 * getSpace(5)(props),
}))``

export const PropertyListItem = styled(BoxUI).attrs({
  p: 3,
  mb: 5,
  backgroundColor: '#d9eeff',
})`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 4;
  border-width: 1px;
  border-color: ${getColor('deepBlue')};
  margin-right: 24px;
`

export const PropertyList = styled.FlatList`
  margin-right: -24px;
  ${space}
`

export const TextButton = TextButtonUI

export const Title = styled(Text).attrs({
  fontFamilyStyle: 'styles.semiBold',
  color: getColor('deepBlue'),
  py: 2,
})``

export const Label = styled(Text)`
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

export const IconButton = styled(IconButtonUI)`
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
