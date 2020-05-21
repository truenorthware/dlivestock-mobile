import React, { Component } from 'react'
import PT from 'prop-types'

import { Alert } from 'react-native'
import { Form, Field } from 'react-final-form'
import { NavigationActions } from 'react-navigation'

import get from 'lodash/get'

import Promisify from 'utils/promisify'
import ValidationService from 'services/validation'
import { SignUpTooltips } from 'services/tooltips'
import { UserTypes } from 'services/dataTypes'
import { RegisterEvents, trackEvent } from 'services/mixpanel'

import { ReactNavigationPropTypes } from 'constants/propTypes'
import { auth } from 'constants/routeNames'

import {
  Container,
  FormInner,
  FormContent,
  FormFooter,
  CenterContent,
  Button,
  Loader,
  Label,
  Separator,
  TextInput,
  Meta,
  HasAccount,
  LinkButton,
  Scrollable,
  Dropdown,
} from './styles'

class SignUp extends Component {
  constructor(props) {
    super(props)

    const { navigation, freights, onGetFreights } = props
    const type = get(navigation, 'state.params.type') || UserTypes.Producer

    this.state = {
      smsCode: '',
      isSmsSent: false,
      email: '',
      type,
    }

    if (type === UserTypes.Driver && freights.length === 0) onGetFreights()
  }

  setLoader = ref => {
    this.loader = ref
  }

  getProducerInitialValues = () => ({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  getDriverInitialValues = () => ({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    company: '',
    license: '',
    password: '',
    confirmPassword: '',
  })

  validate = values => {
    const constraints = {
      firstName: {
        presence: {
          message: 'is required',
          allowEmpty: false,
        },
      },
      lastName: {
        presence: {
          message: 'is required',
          allowEmpty: false,
        },
      },
      phoneNumber: {
        presence: {
          message: 'is required',
          allowEmpty: false,
        },
      },
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

    if (this.state.type === UserTypes.Driver) {
      constraints.company = {
        presence: {
          message: 'is required',
          allowEmpty: false,
        },
      }
      constraints.license = {
        presence: {
          message: 'is required',
          allowEmpty: false,
        },
      }
    }
    return ValidationService.validate(constraints, values)
  }

  createAccount = async values => {
    const { type } = this.state
    const { onSignUp } = this.props
    const { firstName, lastName, phoneNumber, email, password } = values
    const payload = { firstName, lastName, phoneNumber, email, type }

    if (type === UserTypes.Driver) payload.freightId = get(values, 'company[0].value')
    if (type === UserTypes.Driver) payload.license = get(values, 'license')

    trackEvent(RegisterEvents.Name, RegisterEvents.RequestSms, payload)
    trackEvent(RegisterEvents.Name, RegisterEvents.CreateAccount, payload)

    payload.password = password
    return Promisify(onSignUp, payload)
  }

  handleSubmit = async values => {
    const { isSmsSent, email, smsCode } = this.state
    try {
      if (isSmsSent) {
        await this.handleSubmitSmsVerify(values)
        trackEvent(RegisterEvents.Name, RegisterEvents.VerifySmsSuccess, {
          email,
          Sms: values.sms || smsCode,
        })
        return
      }
      this.setState({ email: values.email })
      this.loader.show()
      const { message } = await this.createAccount(values)
      this.loader.hide()
      Alert.alert('Direct Livestock', message, [
        {
          text: 'OK',
          onPress: () => {
            this.loader.hide()
            this.setState({ isSmsSent: true })
          },
          style: 'cancel',
        },
      ])
    } catch (e) {
      Alert.alert('Direct Livestock', e.message, [
        {
          text: 'OK',
          style: 'cancel',
          onPress: this.loader.hide,
        },
      ])
    }
  }

  handleResendSmsRequest = async () => {
    const { onResendSms } = this.props
    const { email } = this.state

    try {
      const { message } = await Promisify(onResendSms, email)
      trackEvent(RegisterEvents.Name, RegisterEvents.ResendSms, { email })
      Alert.alert('Direct Livestock', message, [
        {
          text: 'OK',
          onPress: () => {
            this.setState({ isSmsSent: true })
          },
          style: 'cancel',
        },
      ])
    } catch (e) {
      Alert.alert('Direct Livestock', e.message, [
        {
          text: 'OK',
          style: 'cancel',
        },
      ])
    }
  }

  handleSubmitSmsVerify = async values => {
    const { onVerifySms } = this.props
    const { email } = this.state
    const sms = values.smsCode || this.state.smsCode

    return Promisify(onVerifySms, email, sms)
  }

  handleSignInPress = () => {
    const { navigation } = this.props

    navigation.dispatch(
      NavigationActions.navigate({
        routeName: auth.signIn,
        params: { isVerified: true },
      }),
    )
  }

  renderForm = ({ handleSubmit }) => {
    const { freights } = this.props
    const { isSmsSent, type } = this.state

    return (
      <FormInner>
        {!isSmsSent && (
          <FormContent>
            <Label mt={-24}>Please Fill In Your Details</Label>
            <Field
              name="firstName"
              component={TextInput}
              keyboardType="default"
              placeholder={SignUpTooltips.firstName}
              autoCapitalize="words"
            />

            <Separator />

            <Field
              name="lastName"
              component={TextInput}
              keyboardType="default"
              placeholder={SignUpTooltips.lastName}
              autoCapitalize="words"
            />

            <Separator />

            <Field
              name="phoneNumber"
              component={TextInput}
              keyboardType="phone-pad"
              placeholder={SignUpTooltips.phoneNubmer}
              autoCapitalize="none"
            />

            <Separator />

            <Field
              name="email"
              component={TextInput}
              keyboardType="email-address"
              placeholder={SignUpTooltips.email}
              autoCapitalize="none"
            />

            <Separator />

            {type === UserTypes.Driver && [
              <Field
                name="company"
                component={Dropdown}
                placeholder={SignUpTooltips.company}
                options={freights}
                editable
                key="1"
              />,

              <Separator key="2" />,
            ]}

            {type === UserTypes.Driver && [
              <Field
                name="license"
                component={TextInput}
                keyboardType="default"
                placeholder={SignUpTooltips.license}
                autoCapitalize="characters"
                key="1"
              />,

              <Separator key="2" />,
            ]}

            <Field
              name="password"
              component={TextInput}
              placeholder={SignUpTooltips.password}
              autoCapitalize="none"
              secureTextEntry
            />

            <Separator />

            <Field
              name="confirmPassword"
              component={TextInput}
              placeholder={SignUpTooltips.confirmPassword}
              autoCapitalize="none"
              secureTextEntry
            />

            <Separator />
          </FormContent>
        )}

        {isSmsSent && [
          <Label mt={-24} key="1">
            Please Enter The SMS Verification Code
          </Label>,
          <CenterContent key="2">
            <Field
              name="smsCode"
              component={TextInput}
              keyboardType="number-pad"
              placeholder={SignUpTooltips.smsCode}
              autoCapitalize="none"
            />

            <LinkButton onPress={this.handleResendSmsRequest}>Resend Code</LinkButton>
          </CenterContent>,
        ]}

        <FormFooter>
          <Button title="Submit" onPress={handleSubmit} />

          <Meta>
            <HasAccount>Already have an account?</HasAccount>

            <LinkButton onPress={this.handleSignInPress}>Login</LinkButton>
            <HasAccount> now</HasAccount>
          </Meta>
        </FormFooter>
      </FormInner>
    )
  }

  render() {
    const { type } = this.state
    return (
      <Container>
        <Scrollable>
          <Form
            initialValues={
              type === UserTypes.Producer
                ? this.getProducerInitialValues()
                : this.getDriverInitialValues()
            }
            validate={this.validate}
            render={this.renderForm}
            onSubmit={this.handleSubmit}
          />
          <Loader ref={this.setLoader} />
        </Scrollable>
      </Container>
    )
  }
}

SignUp.propTypes = {
  ...ReactNavigationPropTypes,
  freights: PT.array.isRequired,
  onGetFreights: PT.func.isRequired,
  onResendSms: PT.func.isRequired,
  onSignUp: PT.func.isRequired,
  onVerifySms: PT.func.isRequired,
}

export default SignUp
