import React, { Component } from 'react'
import { Animated, Easing } from 'react-native'
import PT from 'prop-types'

import PickingService from 'services/picking'

import {
  Container,
  StatusBar,
  Overlay,
  OverlayBackground,
  Scrollable,
  Body,
  Title,
  Content,
  TextContent,
  Footer,
} from './styles'

class Modal extends Component {
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

  renderTitle = () => {
    const { title } = this.props

    if (title) {
      return <Title>{title}</Title>
    }

    return null
  }

  renderContent = () => {
    const { content, contentComponent, contentAlign } = this.props

    if (contentComponent) {
      return <Content>{contentComponent}</Content>
    }

    return (
      <Content>
        <TextContent align={contentAlign}>{content}</TextContent>
      </Content>
    )
  }

  renderFooter = () => {
    const { footerComponent } = this.props

    return footerComponent ? <Footer>{footerComponent}</Footer> : null
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

        <Scrollable>
          <Body as={Animated.View} style={bodyStyle}>
            {this.renderTitle()}
            {this.renderContent()}
            {this.renderFooter()}
          </Body>
        </Scrollable>
      </Container>
    )
  }
}

Modal.propTypes = {
  content: PT.string,
  contentAlign: PT.string,
  contentComponent: PT.node,
  footerComponent: PT.node,
  title: PT.string,
}

Modal.defaultProps = {
  content: null,
  contentAlign: 'justify',
  contentComponent: null,
  footerComponent: null,
  title: '',
}

export { Modal }
