import React, { Component } from 'react'
import PT from 'prop-types'

import { Alert } from 'react-native'
import { Form, Field } from 'react-final-form'

import get from 'lodash/get'

import Promisify from 'utils/promisify'

import ValidationService from 'services/validation'
import { BreedTypes, CattleTypes, EnterpriseTypes, MarketTypes } from 'services/businessTypes'
import { VerificationTooltips } from 'services/tooltips'
import { VerificationMessages } from 'services/messages'
import { ProfileEvents, trackEvent } from 'services/mixpanel'

import { ReactNavigationPropTypes } from 'constants/propTypes'
import { profile, verification } from 'constants/routeNames'

import {
  Container,
  FormInner,
  FormContent,
  FormFooter,
  Button,
  Label,
  Separator,
  TextButton,
  TextInput,
  Scrollable,
  Dropdown,
  DropdownMultiple,
} from './styles'

class Business extends Component {
  constructor(props) {
    super(props)

    this.businessInfo = this.getBusinessInfo(props)
    const properties = get(this.businessInfo, 'properties', [])

    this.state = {
      properties,
    }
  }

  componentWillMount() {
    this.didFocusSubscription = this.props.navigation.addListener('willFocus', ({ action }) => {
      if (action.params && action.params.properties) {
        this.setState({ properties: action.params.properties })
      }
    })
  }

  componentWillUnmount() {
    if (this.didFocusSubscription) {
      this.didFocusSubscription.remove()
    }
  }

  getBusinessInfo = props => {
    const businessInfo = get(props, 'navigation.state.params.businessInfo', {})
    let { enterpriseType, cattles } = businessInfo
    const { market, breed } = businessInfo
    const markets = businessInfo.markets || []
    const breeds = businessInfo.breeds || []

    if (enterpriseType) {
      enterpriseType = [EnterpriseTypes.find(type => type.value === enterpriseType)]
    }
    if (cattles) {
      cattles = [CattleTypes.find(type => type.value === cattles)]
    }
    if (market) {
      market.map(item => {
        return markets.push(MarketTypes.find(type => type.value === item))
      })
    }
    if (breed) {
      breed.map(item => {
        return breeds.push(BreedTypes.find(type => type.value === item))
      })
    }
    return {
      ...businessInfo,
      enterpriseType,
      markets,
      breeds,
      cattles,
    }
  }

  getInitialValues = () => {
    const { enterpriseType, cattles, markets, breeds } = this.businessInfo

    return {
      businessName: get(this.businessInfo, 'businessName', ''),
      abn: get(this.businessInfo, 'abn', ''),
      enterpriseType: enterpriseType || '',
      markets: markets || '',
      breeds: breeds || '',
      cattles: cattles || '',
    }
  }

  validate = values => {
    const constraints = {
      businessName: {
        presence: {
          message: 'is required',
          allowEmpty: false,
        },
      },
      abn: {
        presence: {
          message: 'is required',
          allowEmpty: false,
        },
      },
      enterpriseType: {
        presence: {
          message: 'is required',
          allowEmpty: false,
        },
      },
      markets: {
        presence: {
          message: 'is required',
          allowEmpty: false,
        },
      },
      breeds: {
        presence: {
          message: 'is required',
          allowEmpty: false,
        },
      },
      cattles: {
        presence: {
          message: 'is required',
          allowEmpty: false,
        },
      },
    }

    return ValidationService.validate(constraints, values)
  }

  handleAddBusiness = async values => {
    const { businessName, abn, enterpriseType, markets, breeds, cattles } = values
    const { properties } = this.state
    const { onAddBusiness, user } = this.props

    const marketsPayload = markets.map(market => market.value)
    const breedPayload = breeds.map(breed => breed.value)
    const propertyPayload = properties.map(property => ({
      ...property,
      location: [property.location[0].toFixed(4), property.location[1].toFixed(4)],
    }))

    const payload = {
      businessName,
      abn,
      enterpriseType: enterpriseType[0].value,
      market: marketsPayload,
      breed: breedPayload,
      cattles: cattles[0].value,
      properties: propertyPayload,
    }

    if (user.properties.length > 0) {
      const { navigation } = this.props

      navigation.navigate({
        routeName: profile.userInfo,
        params: { businessInfo: payload },
      })
    } else {
      await Promisify(onAddBusiness, payload)
      trackEvent(ProfileEvents.Name, ProfileEvents.AddBusinessInfo, payload)
    }
  }

  handleSubmit = async values => {
    try {
      const { properties } = this.state
      if (!properties || properties.length === 0) {
        Alert.alert('Direct Livestock', VerificationMessages.Property_required, [
          {
            text: 'OK',
            style: 'cancel',
          },
        ])
        return
      }
      await this.handleAddBusiness(values)
    } catch (e) {
      Alert.alert('Direct Livestock', e.message, [
        {
          text: 'OK',
          style: 'cancel',
        },
      ])
    }
  }

  handlePropertyPress = values => () => {
    const { navigation, user } = this.props
    const { properties } = this.state
    const { businessName, abn, enterpriseType, markets, breeds, cattles } = values

    const businessInfo = {
      businessName,
      abn,
      enterpriseType: enterpriseType[0].value,
      market: markets.map(market => market.value),
      breed: breeds.map(breed => breed.value),
      cattles: cattles[0].value,
    }

    if (user.properties.length > 0) {
      navigation.navigate({
        routeName: profile.property,
        params: { properties, businessInfo },
      })
    } else {
      navigation.navigate({
        routeName: verification.property,
        params: { properties, businessInfo },
      })
    }
  }

  handleLogOut = () => this.props.onLogOut()

  renderForm = ({ handleSubmit, values }) => {
    const { properties } = this.state
    const propertyButtonTitle =
      !properties || properties.length === 0
        ? 'Add properties'
        : `Edit properties(${properties.length})`

    return (
      <FormInner>
        <FormContent>
          <Label mt={-24}>Please Enter Your Business Information</Label>
          <Field
            name="businessName"
            component={TextInput}
            keyboardType="default"
            placeholder={VerificationTooltips.businessName}
            autoCapitalize="words"
          />

          <Separator />

          <Field
            name="abn"
            component={TextInput}
            keyboardType="number-pad"
            placeholder={VerificationTooltips.abn}
            autoCapitalize="words"
          />

          <Separator />

          <Field
            name="enterpriseType"
            component={Dropdown}
            placeholder={VerificationTooltips.enterprise}
            options={EnterpriseTypes}
            editable
          />

          <Separator />

          <Field
            name="markets"
            component={DropdownMultiple}
            placeholder={VerificationTooltips.market}
            options={MarketTypes}
            editable
          />

          <Separator />

          <Field
            name="breeds"
            component={DropdownMultiple}
            placeholder={VerificationTooltips.breed}
            options={BreedTypes}
            editable
          />

          <Separator />

          <Field
            name="cattles"
            component={Dropdown}
            placeholder={VerificationTooltips.cattle}
            options={CattleTypes}
            editable
          />

          <Separator />
        </FormContent>

        <FormFooter>
          <TextButton
            title={propertyButtonTitle}
            onPress={this.handlePropertyPress(values)}
            color="deepBlue"
          />

          <Button title="Submit" onPress={handleSubmit} />
          <Button title="Cancel" onPress={this.handleLogOut} variant="secondary" isLast />
        </FormFooter>
      </FormInner>
    )
  }

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

Business.propTypes = {
  ...ReactNavigationPropTypes,
  user: PT.object.isRequired,
  onAddBusiness: PT.func.isRequired,
  onLogOut: PT.func.isRequired,
}

export default Business
