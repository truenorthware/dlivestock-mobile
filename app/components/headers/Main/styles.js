import styled from 'styled-components/native'

import { hitSlopArea } from 'utils/presentational'

import { getMetrics, getColor, getSpace, getLineHeight } from 'theme'
import { arrow2Icon } from 'images'

import { StatusBar as StatusBarBlock } from 'components/blocks'
import { Box, Text, Image, IconButton } from 'components/ui'

export const Container = styled(Box).attrs({
  bg: 'white',
})`
  border-bottom-width: 1px;
  border-color: #3331;
`

export const Background = styled(Image).attrs({
  resizeMode: 'cover',
})`
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0.1;
`

export const StatusBar = styled(StatusBarBlock).attrs(props => ({
  backgroundColor: getColor('clear')(props),
}))``

export const Content = styled(Box).attrs(props => ({
  mt: getMetrics('statusBarHeight')(props),
  py: 4,
  px: 5,
}))`
  height: ${getMetrics('mainHeaderHeight')};
  justify-content: flex-end;
`

export const InnerContent = styled.View`
  flex-direction: row;
  align-items: center;
`

export const Title = styled(Text).attrs({
  fontSize: 3,
  fontFamilyStyle: 'styles.bold',
  numberOfLines: 1,
  color: 'black',
})`
  flex: 1;
`

export const Left = styled(Box).attrs({
  mr: 4,
})``

export const Right = styled(Box).attrs({
  mr: 'auto',
})``

export const Back = styled(IconButton).attrs(props => ({
  iconGlyph: arrow2Icon,
  iconTintColor: 'black',
  hitSlop: hitSlopArea(getSpace(4)(props)),
}))`
  justify-content: center;
  height: ${getLineHeight(3)};
`
