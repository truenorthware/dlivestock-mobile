import styled from 'styled-components/native'

import { BallIndicator } from 'react-native-indicators'

import { getColor } from 'theme'

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`

export const Indicator = styled(BallIndicator).attrs(props => ({
  color: getColor('deepBlue')(props),
}))``
