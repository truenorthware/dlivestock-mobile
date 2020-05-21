import React, { Component } from 'react'
import { Linking, ViewPropTypes } from 'react-native'
import PT from 'prop-types'

import noop from 'lodash/noop'

import { Container, Text } from './styles'

const WWW_URL_PATTERN = /^www\./i

class Link extends Component {
  state = {
    isPressed: false,
  }

  handlePressIn = () => {
    this.setState({ isPressed: true })
  }

  handlePressOut = () => {
    this.setState({ isPressed: false })
  }

  handlePress = () => {
    if (this.props.onPress) {
      return this.props.onPress()
    }

    if (this.props.url) {
      return this.handleUrlNavigate(this.props.url)
    }

    return null
  }

  handleUrlNavigate = url => {
    const normalizedUrl = url.toLowerCase()

    if (WWW_URL_PATTERN.test(normalizedUrl)) {
      this.handleUrlNavigate(`http://${normalizedUrl}`)
    } else {
      Linking.canOpenURL(normalizedUrl).then(supported => {
        if (!supported) {
          // eslint-disable-next-line
          console.error('No handler for URL:', normalizedUrl)
        } else {
          Linking.openURL(normalizedUrl)
        }
      })
    }
  }

  render() {
    const { variant, style, isDisabled, textStyle, fontFamilyStyle, children } = this.props
    const { isPressed } = this.state

    return (
      <Container
        disabled={isDisabled}
        style={style}
        onPress={this.handlePress}
        onPressIn={this.handlePressIn}
        onPressOut={this.handlePressOut}
      >
        <Text
          variant={variant}
          isPressed={isPressed}
          fontFamilyStyle={fontFamilyStyle}
          style={textStyle}
        >
          {children}
        </Text>
      </Container>
    )
  }
}

Link.propTypes = {
  children: PT.node.isRequired,
  fontFamilyStyle: Text.propTypes.fontFamilyStyle,
  isDisabled: PT.bool,
  style: ViewPropTypes.style,
  textStyle: Text.propTypes.style,
  url: PT.string,
  variant: PT.string,
  onPress: PT.func,
}

Link.defaultProps = {
  fontFamilyStyle: Text.defaultProps.fontFamilyStyle,
  isDisabled: false,
  onPress: noop,
  style: Text.defaultProps.style,
  textStyle: Text.defaultProps.style,
  url: null,
  variant: 'primary',
}

export { Link }
