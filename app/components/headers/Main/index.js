import React, { Component, isValidElement } from 'react'
import get from 'lodash/get'
import { ReactNavigationPropTypes } from 'constants/propTypes'

import { RegisterEvents } from 'services/mixpanel'

import {
  Container,
  StatusBar,
  Content,
  InnerContent,
  Title,
  Left,
  Right,
  Back,
  Background,
} from './styles'

class Main extends Component {
  getOptions = () => this.props.scene.descriptor.options

  handleBackPress = () => {
    const { scene } = this.props

    scene.descriptor.navigation.goBack(scene.descriptor.key)
  }

  renderBack = () => <Back onPress={this.handleBackPress} />

  renderLeft() {
    const { scene } = this.props
    const options = this.getOptions()

    if (isValidElement(options.headerLeft) || options.headerLeft === null) {
      return <Left>{options.headerLeft}</Left>
    }

    let result = null

    if (scene.index > 0) {
      result = this.renderBack()
    }

    return result ? <Left>{result}</Left> : null
  }

  renderRight() {
    const options = this.getOptions()

    if (isValidElement(options.headerRight) || options.headerRight === null) {
      return <Right>{options.headerRight}</Right>
    }
    return null
  }

  renderTitle = () => {
    const { scene } = this.props
    const options = this.getOptions()

    if (!options.title) {
      return null
    }

    if (options.title === RegisterEvents.CreateAccount) {
      options.title =
        get(scene, 'route.params.type') === 'Customer'
          ? 'Producer Account Creation'
          : 'Driver Account Creation'
    }

    return <Title>{options.title}</Title>
  }

  render() {
    return (
      <Container>
        <StatusBar barStyle="light-content" />
        <Background />

        <Content>
          <InnerContent>
            {this.renderLeft()}
            {this.renderTitle()}
            {this.renderRight()}
          </InnerContent>
        </Content>
      </Container>
    )
  }
}

Main.propTypes = {
  ...ReactNavigationPropTypes,
}

export { Main }
