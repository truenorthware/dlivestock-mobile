import { TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'
import { getColor } from 'theme'

import { Text as TextUI } from 'components/ui'

export const Touchable = TouchableOpacity

export const Text = styled(TextUI)`
  color: ${getColor('deepBlue')};
  text-decoration: underline solid ${getColor('deepBlue')};
  font-weight: 900;
`
