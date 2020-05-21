import styled, { css } from 'styled-components/native'
import { space, color, borderRadius, borderColor } from 'styled-system'

import { fontFamilyComplex, getColor } from 'theme'
import { getSpace } from 'theme/rules'

import { logoImage, arrow2Icon, goBGIcon } from 'images'
import { Link, Image, Box, IconButton, Icon as IconUI } from 'components/ui'

export { Loader } from 'components/ui'

export * from '../common/styles'

export const LinkButton = styled(Link).attrs({
  textStyle: {
    textAlign: 'center',
  },
  fontFamilyStyle: 'styles.medium',
})`
  ${space}
`
export const Underline = styled.Text`
  text-decoration: underline solid #fff;
`

export const BackgroundImage = styled.ImageBackground`
  width: 100%;
  height: 100%;
  overflow: hidden;
`

export const Container = styled(Box).attrs({
  bg: 'clear',
})`
  flex: 1;
`

export const Logos = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`

export const Logo = styled(Image).attrs({
  source: logoImage,
})`
  width: 65%;
  margin-bottom: 50px;
`

export const SignUpTypes = styled.View`
  flex: 1;
  justify-content: center;
`

export const FieldSet = styled.View`
  position: relative;
`

export const Icon = styled(IconUI)`
  position: absolute;
  top: 18px;
  left: 16px;
  z-index: 1;
`

export const OptionText = styled.View`
  background: #fff;
  padding: 5px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  ${space}
`

export const BackButton = styled(IconButton).attrs({
  iconGlyph: arrow2Icon,
  iconSize: 20,
})`
  position: absolute;
  top: ${getSpace(2)};
  left: ${getSpace(2)};
`

export const Go2SignupButton = styled(IconButton).attrs({
  iconGlyph: goBGIcon,
  iconSize: 45,
})``

export const Input = styled.TextInput.attrs({
  bg: 'white',
  fontFamilyGroup: 'groups.montserrat',
  fontFamilyStyle: 'styles.regular',
})`
  width: 100%;
  height: 58px;
  padding: 4px 4px 4px 60px;
  margin: 5px 0;
  font-size: 14px;
  border: 1px solid #fff;

  ${props =>
    css`
      border-color: ${getColor(props.isFocused ? 'deepBlue' : 'dustyGray')(props)};
    `}

  ${props =>
    props.hasError &&
    css`
      border-color: ${getColor('vividTangerine')(props)};
    `}

  ${color}
  ${borderRadius}
  ${borderColor}
  ${fontFamilyComplex}
`
