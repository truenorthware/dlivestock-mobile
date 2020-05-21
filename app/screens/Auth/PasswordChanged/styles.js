import styled from 'styled-components/native'

import { Image as ImageUI, Text } from 'components/ui'

export * from '../common/styles'

export const Content = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`

export const Description = styled(Text).attrs(() => ({
  py: 5,
  color: 'black',
  fontSize: 1,
  fontFamilyStyle: 'styles.medium',
}))`
  text-align: center;
`

export const Image = ImageUI
