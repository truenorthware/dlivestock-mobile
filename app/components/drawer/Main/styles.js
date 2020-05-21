import styled from 'styled-components/native'
import LinearGradient from 'react-native-linear-gradient'
import { TouchableOpacity } from 'react-native'
import { height } from 'styled-system'

import { getColor } from 'theme'
import { Button as ButtonUI, Box, Text } from 'components/ui'

export const Container = styled.SafeAreaView`
  flex: 1;
`

export const MenuContainer = styled(LinearGradient).attrs(props => ({
  colors: [getColor('lightBlue')(props), getColor('deepBlue')(props)],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
}))`
  flex: 1;
`

export const FullName = styled(Text).attrs({
  mt: 8,
  pl: 4,
  color: 'white',
  fontSize: 3,
  fontFamilyStyle: 'styles.semiBold',
})`
  font-weight: 900;
`

export const Email = styled(Text).attrs({
  mt: 2,
  mb: 8,
  pl: 4,
  color: 'white',
  fontSize: 1,
  fontFamilyStyle: 'styles.semiBold',
})``

export const Footer = styled(Box)`
  justify-content: center;
  align-items: center;
`

export const Touchable = TouchableOpacity

export const ActiveMenuItem = styled(Box).attrs({
  p: 4,
  backgroundColor: 'deepBlue',
})``

export const InActiveMenuItem = styled(Box).attrs({
  p: 4,
  backgroundColor: 'transparent',
})``

export const MenuTitle = styled(Text).attrs({
  color: 'white',
  fontSize: 1,
  fontFamilyStyle: 'styles.semiBold',
})``

export const Button = styled(ButtonUI)`
  ${height}
`
