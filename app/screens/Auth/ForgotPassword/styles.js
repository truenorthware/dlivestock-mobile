import styled from 'styled-components/native'
import { space } from 'styled-system'

import { Link } from 'components/ui'

export * from '../common/styles'

export const LinkButton = styled(Link).attrs({
  mt: 5,
  textStyle: {
    textAlign: 'center',
  },
  fontFamilyStyle: 'styles.medium',
})`
  ${space}
`
