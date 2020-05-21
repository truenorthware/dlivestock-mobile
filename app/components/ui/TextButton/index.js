import React from 'react'
import { ViewPropTypes } from 'react-native'
import PT from 'prop-types'

import noop from 'lodash/noop'

import { Container, Touchable, Text } from './styles'

const TextButton = ({ color, title, isDisabled, style, onPress, ...restProps }) => {
  return (
    <Container {...restProps}>
      <Touchable disabled={isDisabled} onPress={onPress} style={style}>
        <Text color={color}>{title}</Text>
      </Touchable>
    </Container>
  )
}

TextButton.propTypes = {
  color: PT.string,
  isDisabled: PT.bool,
  style: ViewPropTypes.style,
  title: PT.string.isRequired,
  onPress: PT.func,
}

TextButton.defaultProps = {
  color: 'deepBlue',
  isDisabled: false,
  onPress: noop,
  style: {},
}

export { TextButton }
