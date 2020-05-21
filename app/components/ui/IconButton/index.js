import React from 'react'
import { TouchableOpacity, ViewPropTypes } from 'react-native'
import PT from 'prop-types'

import keys from 'lodash/keys'
import noop from 'lodash/noop'
import pick from 'lodash/pick'

import { Touchable, Icon } from './styles'

const TouchableOpacityPropTypesKeys = keys(TouchableOpacity.propTypes)

const IconButton = ({ iconGlyph, iconSize, iconTintColor, style, onPress, ...restProps }) => {
  const touchableProps = pick(restProps, TouchableOpacityPropTypesKeys)

  return (
    <Touchable {...touchableProps} style={style} onPress={onPress}>
      <Icon glyph={iconGlyph} size={iconSize} tintColor={iconTintColor} />
    </Touchable>
  )
}

IconButton.propTypes = {
  iconGlyph: Icon.propTypes.glyph,
  iconSize: Icon.propTypes.size,
  iconTintColor: Icon.propTypes.tintColor,
  style: ViewPropTypes.style,
  onPress: PT.func,
}

IconButton.defaultProps = {
  iconGlyph: null,
  iconSize: {},
  iconTintColor: null,
  onPress: noop,
  style: {},
}

export { IconButton }
