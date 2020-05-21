import { Text as TextRN } from 'react-native'
import PT from 'prop-types'

import styled from 'styled-components/native'
import { space, color, fontSize, fontWeight } from 'styled-system'

import { fontFamilyComplex, lineHeightComplex } from 'theme'

import appConfig from 'config/app'

const Text = styled.Text`
  ${color}
  ${space}
  ${fontSize}
  ${fontWeight}
  ${fontFamilyComplex}
  ${lineHeightComplex}
`

Text.propTypes = {
  ...TextRN.propTypes,
  allowFontScaling: PT.bool,
  bg: PT.string,
  color: PT.string,
  fontFamilyGroup: PT.string,
  fontFamilyStyle: PT.string,
  fontSize: PT.number,
}

Text.defaultProps = {
  ...TextRN.defaultProps,
  allowFontScaling: appConfig.allowTextFontScaling,
  bg: 'clear',
  color: 'tundora',
  fontFamilyGroup: 'variants.primary.group',
  fontFamilyStyle: 'variants.primary.style',
  fontSize: 1,
}

export { Text }
