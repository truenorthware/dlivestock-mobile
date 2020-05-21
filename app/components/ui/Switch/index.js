import React, { Component } from 'react'
import { Animated } from 'react-native'
import PT from 'prop-types'

import { withTheme } from 'styled-components/native'

import { FinalFormPropTypes } from 'constants/propTypes'

import { Touchable, Container, Bubble, getActiveColor, getInactiveColor } from './styles'

class SwitchComponent extends Component {
  state = {
    animation: new Animated.Value(this.props.input.value ? 1 : 0),
  }

  componentWillReceiveProps(nextProps) {
    const prevInput = this.props.input
    const nextInput = nextProps.input

    if (prevInput.value !== nextInput.value) {
      this.animateSwitch(nextInput.value)
    }
  }

  animateSwitch = isEnabled => {
    const { animation } = this.state

    Animated.timing(animation, {
      toValue: isEnabled ? 1 : 0,
      duration: 170,
    }).start()
  }

  calculateBubbleStyle = (isEnabled, interpolatedColor) => {
    const { width, height, bubbleSize, borderWidth } = this.props
    const { animation } = this.state

    const space = height - bubbleSize - borderWidth * 2
    const innerSpace = space / 2

    const leftInterpolation = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [innerSpace, width - bubbleSize - borderWidth * 2 - innerSpace],
    })

    return {
      top: innerSpace,
      left: leftInterpolation,
      backgroundColor: interpolatedColor,
    }
  }

  handlePress = () => {
    const { input } = this.props
    input.onChange(!input.value)
  }

  render() {
    const {
      input,
      width,
      height,
      bubbleSize,
      borderWidth,
      // colorActive,
      // colorInactive,
    } = this.props
    const { animation } = this.state

    const activeColor = getActiveColor(this.props)
    const inactiveColor = getInactiveColor(this.props)

    const colorInterpolation = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [inactiveColor, activeColor],
    })

    const containerStyle = {
      borderColor: colorInterpolation,
    }

    const bubbleStyle = this.calculateBubbleStyle(input.value, colorInterpolation)

    return (
      <Touchable onPress={this.handlePress}>
        <Container
          as={Animated.View}
          width={width}
          height={height}
          borderWidth={borderWidth}
          style={containerStyle}
        >
          <Bubble as={Animated.View} size={bubbleSize} style={bubbleStyle} />
        </Container>
      </Touchable>
    )
  }
}

SwitchComponent.propTypes = {
  ...FinalFormPropTypes,
  borderWidth: PT.number,
  bubbleSize: PT.number,
  height: PT.number,
  variant: PT.string, // eslint-disable-line react/no-unused-prop-types
  width: PT.number,
}

SwitchComponent.defaultProps = {
  borderWidth: 1,
  bubbleSize: 24,
  height: 32,
  variant: 'primary',
  width: 60,
}

export const Switch = withTheme(SwitchComponent)
