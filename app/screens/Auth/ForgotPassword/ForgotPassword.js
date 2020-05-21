import React, { Component } from 'react'
import PT from 'prop-types'

import { Form, Field } from 'react-final-form'
import { NavigationActions } from 'react-navigation'

import ValidationService from 'services/validation'

import { ReactNavigationPropTypes } from 'constants/propTypes'
import { auth } from 'constants/routeNames'

import {
  Container,
  FormInner,
  FormContent,
  FormFooter,
  Button,
  LinkButton,
  TextInput,
  Scrollable,
} from './styles'

class ForgotPassword extends Component {
  getInitialValues = () => ({
    email: '',
  })

  validate = values => {
    const constraints = {
      email: {
        presence: true,
        email: true,
      },
      password: {
        presence: true,
        length: { minimum: 8 },
      },
      confirmPassword: {
        presence: {
          message: 'is required',
          allowEmpty: false,
        },
        equality: 'password',
      },
    }

    return ValidationService.validate(constraints, values)
  }

  handleSubmit = async values => {
    const { navigation } = this.props

    const response = await new Promise(resolve => this.props.onResetPassword(values.email, resolve))

    if (response.ok) {
      navigation.dispatch(NavigationActions.navigate({ routeName: auth.passwordChanged }))
    }
  }

  handleBackPress = () => {
    const { navigation } = this.props

    navigation.goBack()
  }

  renderForm = ({ handleSubmit }) => (
    <FormInner>
      <FormContent>
        <Field
          name="email"
          component={TextInput}
          keyboardType="email-address"
          label="Email"
          placeholder="Email address"
          autoCapitalize="none"
        />

        <Field
          name="password"
          component={TextInput}
          label="Password"
          placeholder="Create a new password"
          autoCapitalize="none"
          secureTextEntry
        />

        <Field
          name="confirmPassword"
          component={TextInput}
          label="Confirm password"
          placeholder="Confirm your password"
          autoCapitalize="none"
          secureTextEntry
          isLast
        />
      </FormContent>

      <FormFooter>
        <Button title="Reset password" onPress={handleSubmit} />

        <LinkButton onPress={this.handleBackPress}>Just kidding. I remembered</LinkButton>
      </FormFooter>
    </FormInner>
  )

  render() {
    return (
      <Container>
        <Scrollable>
          <Form
            initialValues={this.getInitialValues()}
            validate={this.validate}
            render={this.renderForm}
            onSubmit={this.handleSubmit}
          />
        </Scrollable>
      </Container>
    )
  }
}

ForgotPassword.propTypes = {
  ...ReactNavigationPropTypes,
  onResetPassword: PT.func.isRequired,
}

export default ForgotPassword
