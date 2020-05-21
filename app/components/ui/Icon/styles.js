import styled from 'styled-components/native'
import { space, backgroundColor, size } from 'styled-system'

import { Image } from '../Image'

export const Container = styled(Image)`
  max-width: 100%;

  ${size}
  ${space}
  ${backgroundColor}
`
