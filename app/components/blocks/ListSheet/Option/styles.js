import styled from 'styled-components/native'

import { Box } from 'components/ui/Box'
import { Text } from 'components/ui/Text'

export const Touchable = styled.TouchableOpacity``

export const Container = styled(Box).attrs(props => ({
  px: 4,
  bg: props.isSelected ? 'deepBlue' : 'white',
}))`
  border-radius: 999;
  justify-content: center;
`

export const Label = styled(Text).attrs(props => ({
  color: props.isSelected ? 'white' : 'tundora',
}))``
