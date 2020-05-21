import styled from 'styled-components/native'

import { BallIndicator } from 'react-native-indicators'

import { getColor } from 'theme'

import { StatusBar as StatusBarBlock } from 'components/blocks/StatusBar'

import { Box } from '../Box'

export const Container = styled.Modal.attrs({
  animationType: 'none',
  transparent: true,
})``

export const StatusBar = styled(StatusBarBlock).attrs(props => ({
  backgroundColor:
    props.overlay === 'dark' ? getColor('overlay')(props) : getColor('overlayLight')(props),
}))``

export const Overlay = styled.TouchableWithoutFeedback``

export const OverlayBackground = styled(Box).attrs({
  bg: 'overlayLight',
})`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`

export const Body = styled.View`
  flex: 1;
  width: 100%;
  align-items: center;
  justify-content: center;
`

export const Indicator = styled(BallIndicator).attrs(props => ({
  color: getColor('deepBlue')(props),
}))``
