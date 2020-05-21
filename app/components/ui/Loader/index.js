import React, { Component } from 'react'
import { Animated, Easing } from 'react-native'

import PickingService from 'services/picking'

import { Container, StatusBar, Overlay, OverlayBackground, Body, Indicator } from './styles'

class Loader extends Component {
  state = {
    isVisible: false,
    bodyAnimation: new Animated.Value(0),
    overlayAnimation: new Animated.Value(0),
  }

  show = () => {
    this.setState({ isVisible: true }, this.showModal)
  }

  hide = () => {
    this.hideModal(() => this.setState({ isVisible: false }))
  }

  showModal = () => {
    const { bodyAnimation, overlayAnimation } = this.state

    Animated.parallel([
      Animated.timing(bodyAnimation, {
        toValue: 1,
        duration: 250,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(overlayAnimation, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.ease),
      }),
    ]).start()
  }

  hideModal = callback => {
    const { bodyAnimation, overlayAnimation } = this.state

    Animated.parallel([
      Animated.timing(bodyAnimation, {
        toValue: 0,
        duration: 250,
      }),
      Animated.timing(overlayAnimation, {
        toValue: 0,
        duration: 400,
      }),
    ]).start(callback)
  }

  handleCancel = () => {
    this.hide()
  }

  render() {
    const { isVisible, bodyAnimation, overlayAnimation } = this.state

    const statusBar = PickingService.platformLazy({
      android: () => <StatusBar />,
    })

    const overlayStyle = { opacity: overlayAnimation }
    const bodyStyle = { opacity: bodyAnimation }

    return (
      <Container visible={isVisible} onClose={this.handleCancel}>
        {statusBar}

        <Overlay onPress={this.handleCancel}>
          <OverlayBackground as={Animated.View} style={overlayStyle} />
        </Overlay>
        <Body as={Animated.View} style={bodyStyle}>
          <Indicator />
        </Body>
      </Container>
    )
  }
}

export { Loader }
