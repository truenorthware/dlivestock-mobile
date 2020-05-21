import React, { Component } from 'react'

import { Form } from 'react-final-form'
import { NavigationActions } from 'react-navigation'

import { ReactNavigationPropTypes } from 'constants/propTypes'
import { auth } from 'constants/routeNames'

import {
  Container,
  FormInner,
  Content,
  FormFooter,
  Button,
  Description,
  Scrollable,
} from './styles'

class PasswordChanged extends Component {
  handleSubmit = () => {
    const { navigation } = this.props

    navigation.dispatch(NavigationActions.navigate({ routeName: auth.signIn }))
  }

  renderForm = ({ handleSubmit }) => {
    return (
      <FormInner>
        <Content>
          <Description>{`A new password has been set.\nThis time try to remember.`}</Description>
        </Content>

        <FormFooter>
          <Button title="Back" onPress={handleSubmit} />
        </FormFooter>
      </FormInner>
    )
  }

  render() {
    return (
      <Container>
        <Scrollable>
          <Form render={this.renderForm} onSubmit={this.handleSubmit} />
        </Scrollable>
      </Container>
    )
  }
}

PasswordChanged.propTypes = {
  ...ReactNavigationPropTypes,
}

export default PasswordChanged
