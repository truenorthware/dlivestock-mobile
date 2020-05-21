import React, { Component } from 'react'
import { ViewPropTypes } from 'react-native'
import PT from 'prop-types'

import noop from 'lodash/noop'

import { Container, OverlayBackground, Touchable, Text } from './styles'

class Button extends Component {
  state = {
    isPressed: false,
  }

  handlePressIn = () => {
    this.setState({ isPressed: true })
  }

  handlePressOut = () => {
    this.setState({ isPressed: false })
  }

  render() {
    const { variant, title, isDisabled, style, onPress, iconLeft, iconRight } = this.props
    const { isPressed } = this.state

    const titleEl = title && (
      <Text variant={variant} isPressed={isPressed}>
        {title}
      </Text>
    )

    return (
      <Touchable
        disabled={isDisabled}
        onPress={onPress}
        onPressIn={this.handlePressIn}
        onPressOut={this.handlePressOut}
      >
        <Container style={style} variant={variant} isPressed={isPressed} isDisabled={isDisabled}>
          <OverlayBackground variant={variant} title={title}>
            {iconLeft}

            {titleEl}

            {iconRight}
          </OverlayBackground>
        </Container>
      </Touchable>
    )
  }
}

Button.propTypes = {
  iconLeft: PT.object,
  iconRight: PT.object,
  isDisabled: PT.bool,
  style: ViewPropTypes.style,
  title: PT.string,
  variant: PT.string,
  onPress: PT.func,
}

Button.defaultProps = {
  iconLeft: null,
  iconRight: null,
  isDisabled: false,
  onPress: noop,
  style: {},
  title: null,
  variant: 'primary',
}

export { Button }
