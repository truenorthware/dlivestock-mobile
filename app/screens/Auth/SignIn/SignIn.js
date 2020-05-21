import React, { Component } from 'react'
import PT from 'prop-types'

import { Animated, Easing, Alert } from 'react-native'

import { Form, Field } from 'react-final-form'
import { NavigationActions } from 'react-navigation'

import { backgroundImage, emailIcon, passwordIcon } from 'images'
import { UserTypes } from 'services/dataTypes'

import get from 'lodash/get'

import Promisify from 'utils/promisify'
import ValidationService from 'services/validation'
import { getFcmToken } from 'services/fcm'

import { ReactNavigationPropTypes } from 'constants/propTypes'
import { auth } from 'constants/routeNames'

import {
  BackgroundImage,
  Container,
  Logos,
  Logo,
  FormInner,
  FormContent,
  LinkButton,
  Underline,
  Loader,
  Button,
  BackButton,
  Go2SignupButton,
  OptionText,
  Text,
  SignUpTypes,
  Scrollable,
} from './styles'

import TextInput from './TextInput'

class SignIn extends Component {
  state = {
    isSignUp: false,
    showAnimation: new Animated.Value(0),
    hideAnimation: new Animated.Value(1),
  }

  async componentDidMount() {
    this.fcmToken = await getFcmToken()
  }

  setLoader = ref => {
    this.loader = ref
  }

  getInitialValues = () => ({
    email: '',
    password: '',
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
    }

    return ValidationService.validate(constraints, values)
  }

  handleForgotPress = () => {
    const { navigation } = this.props

    navigation.dispatch(NavigationActions.navigate({ routeName: auth.forgotPassword }))
  }

  showSignUpType = () => {
    const { showAnimation } = this.state

    this.setState({ isSignUp: true })
    Animated.timing(showAnimation, {
      toValue: 1,
      duration: 250,
      easing: Easing.out(Easing.ease),
    }).start()
  }

  handleShowSignUpTypePress = () => {
    const { hideAnimation } = this.state

    Animated.timing(hideAnimation, {
      toValue: 0,
      duration: 250,
      easing: Easing.in(Easing.ease),
    }).start(this.showSignUpType)
  }

  handleSignUpPress = type => () => {
    const { navigation } = this.props

    this.setState({ isSignUp: false })
    navigation.dispatch(NavigationActions.navigate({ routeName: auth.signUp, params: { type } }))
  }

  handleCancelPress = () => {
    const { hideAnimation, showAnimation } = this.state

    Animated.timing(showAnimation, {
      toValue: 0,
      duration: 250,
      easing: Easing.in(Easing.ease),
    }).start(() => {
      this.setState({ isSignUp: false })
      Animated.timing(hideAnimation, {
        toValue: 1,
        duration: 250,
        easing: Easing.in(Easing.ease),
      }).start()
    })
  }

  handleSubmit = async values => {
    const { onSignIn } = this.props
    const refererParams = get(this.props, 'navigation.state.params')

    try {
      this.loader.show()
      await Promisify(onSignIn, values.email, values.password, this.fcmToken, refererParams)
      this.loader.hide()
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

  renderForm = ({ handleSubmit }) => (
    <FormInner>
      <FormContent>
        <Field
          name="email"
          icon={emailIcon}
          component={TextInput}
          keyboardType="email-address"
          placeholder="Email address"
          autoCapitalize="none"
        />
        <Field
          name="password"
          icon={passwordIcon}
          component={TextInput}
          placeholder="Password"
          autoCapitalize="none"
          secureTextEntry
          isLast
        />

        <Button
          title="Login"
          onPress={handleSubmit}
          variant="tertiary"
          mt={6}
          width={150}
          borderRadius={30}
        />

        <LinkButton onPress={this.handleForgotPress} mt={7} variant="secondary">
          Forgot your password?
        </LinkButton>
        <LinkButton onPress={this.handleShowSignUpTypePress} mt={3} variant="secondary">
          Don't have an account? <Underline>Sign Up</Underline> now
        </LinkButton>
      </FormContent>
    </FormInner>
  )

  renderLogin = () => {
    const { isSignUp, hideAnimation } = this.state

    const hideStyle = { opacity: hideAnimation }

    if (!isSignUp) {
      return (
        <Form
          style={hideStyle}
          initialValues={this.getInitialValues()}
          validate={this.validate}
          render={this.renderForm}
          onSubmit={this.handleSubmit}
        />
      )
    }
    return null
  }

  renderSignup = () => {
    const { isSignUp, showAnimation } = this.state

    const showStyle = { opacity: showAnimation }

    if (isSignUp) {
      return (
        <SignUpTypes as={Animated.View} style={showStyle}>
          <Text
            mx="auto"
            mb={4}
            fontSize={3}
            color="white"
            fontFamilyStyle="styles.bold"
            fontWeight={900}
          >
            Select Your Option
          </Text>

          <OptionText>
            <Text ml={3} fontSize="14px" fontFamilyStyle="styles.bold" fontWeight={700}>
              I'm a Producer
            </Text>
            <Go2SignupButton onPress={this.handleSignUpPress(UserTypes.Producer)} />
          </OptionText>

          <OptionText mt={4}>
            <Text ml={3} fontSize="14px" fontFamilyStyle="styles.bold" fontWeight={700}>
              I'm a Driver
            </Text>
            <Go2SignupButton onPress={this.handleSignUpPress(UserTypes.Driver)} />
          </OptionText>

          <BackButton onPress={this.handleCancelPress} />
        </SignUpTypes>
      )
    }

    return null
  }

  render() {
    return (
      <BackgroundImage source={backgroundImage} resizeMode="cover">
        <Container>
          <Scrollable>
            {!this.state.isSignUp && (
              <Logos as={Animated.View}>
                <Logo />
              </Logos>
            )}

            {this.renderLogin()}
            {this.renderSignup()}
            <Loader ref={this.setLoader} />
          </Scrollable>
        </Container>
      </BackgroundImage>
    )
  }
}

SignIn.propTypes = {
  ...ReactNavigationPropTypes,
  onSignIn: PT.func.isRequired,
}

export default SignIn
