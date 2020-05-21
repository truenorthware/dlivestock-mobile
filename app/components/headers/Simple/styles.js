import styled from 'styled-components/native'
import { backgroundColor } from 'styled-system'

import chroma from 'chroma-js'

import { getMetrics, getColor } from 'theme'

import { StatusBar as StatusBarBlock } from 'components/blocks'

export const Container = styled.View`
  height: ${getMetrics('statusBarHeight')};

  ${backgroundColor}
`

export const StatusBar = styled(StatusBarBlock).attrs(props => ({
  backgroundColor: props.bg
    ? getColor(props.bg)(props)
    : chroma(getColor('black')(props))
        .alpha(0.4)
        .css(),
}))``
