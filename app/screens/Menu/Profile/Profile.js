import React, { Component } from 'react'
import PT from 'prop-types'

import { Alert } from 'react-native'
import { Form, Field } from 'react-final-form'

import get from 'lodash/get'
import pick from 'lodash/pick'

import { profile } from 'constants/routeNames'
import { ReactNavigationPropTypes } from 'constants/propTypes'

import Promisify from 'utils/promisify'

import ValidationService from 'services/validation'
import { ProfileMessages } from 'services/messages'
import { SignUpTooltips } from 'services/tooltips'
import { UserTypes } from 'services/dataTypes'
import { ProfileEvents, trackEvent } from 'services/mixpanel'

import {
  Container,
  FormInner,
  FormContent,
  FormFooter,
  Button,
  Label,
  TextInput,
  Scrollable,
  Dropdown,
} from './styles'

class SignUp extends Component {
  constructor(props) {
    super(props)

    const { user, userType, freights, onGetFreights } = props
    const businessInfo = pick(user, [
      'businessName',
      'abn',
      'enterpriseType',
      'market',
      'breed',
      'cattles',
      'properties',
    ])

    this.state = {
      businessInfo,
    }

    if (userType === UserTypes.Driver && freights.length === 0) onGetFreights()
  }

  async componentDidMount() {
    this.didFocusSubscription = this.props.navigation.addListener('willFocus', ({ action }) => {
      if (action.params && action.params.businessInfo) {
        this.setState({ businessInfo: action.params.businessInfo })
      }
    })
  }

  componentWillUnmount() {
    if (this.didFocusSubscription) {
      this.didFocusSubscription.remove()
    }
  }

  getProducerInitialValues = () => {
    const { user } = this.props
    return pick(user, ['firstName', 'lastName', 'phoneNumber', 'email'])
  }

  getDriverInitialValues = () => {
    const { user } = this.props
    const values = pick(user, ['firstName', 'lastName', 'phoneNumber', 'email', 'license'])
    return {
      ...values,
      freightDetail: [
        {
          value: get(user, 'freightId'),
          label: get(user, 'freightDetail.name'),
          extendedLabel: get(user, 'freightDetail.name'),
        },
      ],
    }
  }

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
    }

    if (this.props.userType === UserTypes.Driver) {
      constraints.freightDetail = {
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

  updateProducer = async values => {
    const { user, onUpdateProfile } = this.props
    const { businessInfo } = this.state
    const payload = {
      id: user.id,
      ...pick(values, ['firstName', 'lastName', 'phoneNumber', 'email']),
      ...businessInfo,
    }
    trackEvent(ProfileEvents.Name, ProfileEvents.UpdateProducerProfile, payload)
    return Promisify(onUpdateProfile, payload)
  }

  updateDriver = async values => {
    const { user, userType, onUpdateProfile } = this.props
    const payload = {
      id: user.id,
      type: userType,
      ...pick(values, ['firstName', 'lastName', 'phoneNumber', 'email', 'license']),
      freightId: get(values, 'freightDetail[0].value'),
    }
    trackEvent(ProfileEvents.Name, ProfileEvents.UpdateDriverProfile, payload)
    return Promisify(onUpdateProfile, payload)
  }

  handleSubmit = async values => {
    try {
      const { userType } = this.props

      if (userType === UserTypes.Producer) await this.updateProducer(values)
      else if (userType === UserTypes.Driver) await this.updateDriver(values)
      else return

      Alert.alert('Direct Livestock', ProfileMessages.Update_success, [
        {
          text: 'OK',
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

  handleEditBusinessInfo = () => {
    const { navigation } = this.props
    const { businessInfo } = this.state

    navigation.navigate({ routeName: profile.business, params: { businessInfo } })
  }

  renderForm = ({ handleSubmit }) => {
    const { freights, userType } = this.props

    return (
      <FormInner>
        <FormContent>
          <Label>Please Edit Your Details</Label>
          <Field
            name="firstName"
            component={TextInput}
            keyboardType="default"
            label="First name"
            placeholder={SignUpTooltips.firstName}
            autoCapitalize="words"
          />

          <Field
            name="lastName"
            component={TextInput}
            keyboardType="default"
            label="Last name"
            placeholder={SignUpTooltips.lastName}
            autoCapitalize="words"
          />

          <Field
            name="phoneNumber"
            component={TextInput}
            keyboardType="phone-pad"
            label="Phone number"
            placeholder={SignUpTooltips.phoneNubmer}
            autoCapitalize="none"
          />

          <Field
            name="email"
            component={TextInput}
            keyboardType="email-address"
            label="Email"
            placeholder={SignUpTooltips.email}
            autoCapitalize="none"
          />

          {userType === UserTypes.Driver && (
            <Field
              name="freightDetail"
              component={Dropdown}
              label="Freight company"
              placeholder={SignUpTooltips.company}
              options={freights}
              editable
            />
          )}

          {userType === UserTypes.Driver && (
            <Field
              name="license"
              component={TextInput}
              keyboardType="default"
              label="Driver license"
              placeholder={SignUpTooltips.license}
              autoCapitalize="characters"
            />
          )}
        </FormContent>

        <FormFooter>
          {userType === UserTypes.Producer && (
            <Button
              title="Edit Business Info"
              onPress={this.handleEditBusinessInfo}
              variant="tertiary"
            />
          )}

          <Button title="Submit" onPress={handleSubmit} />
        </FormFooter>
      </FormInner>
    )
  }

  render() {
    const { userType } = this.props
    return (
      <Container>
        <Scrollable>
          <Form
            initialValues={
              userType === UserTypes.Producer
                ? this.getProducerInitialValues()
                : this.getDriverInitialValues()
            }
            validate={this.validate}
            render={this.renderForm}
            onSubmit={this.handleSubmit}
          />
        </Scrollable>
      </Container>
    )
  }
}

SignUp.propTypes = {
  ...ReactNavigationPropTypes,
  freights: PT.array.isRequired,
  user: PT.object.isRequired,
  userType: PT.string.isRequired,
  onUpdateProfile: PT.func.isRequired,
}

export default SignUp
