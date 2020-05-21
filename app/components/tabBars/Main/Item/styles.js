import styled from 'styled-components/native'

import { Box, Text, Icon as IconUI } from 'components/ui'

export const Container = styled(Box).attrs({
  pb: 2,
})`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  align-items: center;
  justify-content: flex-end;
`

export const Icon = IconUI

export const Label = styled(Text).attrs({
  fontFamilyStyle: 'styles.semiBold',
  fontSize: 10,
  lineHeight: 13,
  mt: 2,
})``
