import styled from 'styled-components/native'

import { hitSlopArea } from 'utils/presentational'
import { getLineHeight, getSpace } from 'theme'

import { menuIcon } from 'images'

import { IconButton } from '../IconButton'

export const Hamburger = styled(IconButton).attrs(props => ({
  iconGlyph: menuIcon,
  iconTintColor: 'black',
  hitSlop: hitSlopArea(getSpace(4)(props)),
}))`
  justify-content: center;
  height: ${getLineHeight(3)};
`
