import React, { Component } from 'react'

import { Alert } from 'react-native'
import { Form, Field } from 'react-final-form'
import { PROVIDER_GOOGLE, Marker } from 'react-native-maps'

import filter from 'lodash/filter'
import get from 'lodash/get'
import findIndex from 'lodash/findIndex'
import cloneDeep from 'lodash/cloneDeep'

import ValidationService from 'services/validation'
import { VerificationMessages } from 'services/messages'
import { VerificationTooltips } from 'services/tooltips'

import { ReactNavigationPropTypes } from 'constants/propTypes'
import { verification } from 'constants/routeNames'

import { circleEditIcon, circleTrashIcon } from 'images'

import {
  Container,
  FormInner,
  FormContent,
  FormFooter,
  Button,
  TextInput,
  Scrollable,
  MapView,
  PropertyListItem,
  PropertyList,
  Label,
  Separator,
  Row,
  Box,
  IconButton,
  PropertyView,
  Title,
} from './styles'

class Property extends Component {
  constructor(props) {
    super(props)
    this.businessInfo = get(props, 'navigation.state.params.businessInfo', {})
    const properties = get(props, 'navigation.state.params.properties', [])

    this.state = {
      properties,
      region: {
        latitudeDelta: 1,
        longitudeDelta: 1,
        latitude: -27.249,
        longitude: 146.0128,
      },
      editingProperty: null,
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        this.setState({
          region: {
            latitudeDelta: 1,
            longitudeDelta: 1,
            latitude: coords.latitude,
            longitude: coords.longitude,
          },
        })
      },
      error => {
        console.log(error)
      },
    )
  }

  getInitialValues = () => ({
    name: '',
    pic: '',
    geolocation: '',
  })

  setScrollView = ref => {
    this.scrollView = ref
  }

  validate = values => {
    const constraints = {
      name: {
        presence: {
          message: 'is required',
          allowEmpty: false,
        },
      },
      pic: {
        presence: {
          message: 'is required',
          allowEmpty: false,
        },
      },
    }

    return ValidationService.validate(constraints, values)
  }

  /*
  ## pragma mark - Map/Marker event handlers
   */
  handleRegionChange = region => {
    if (
      this.state.region.latitude.toFixed(4) !== region.latitude.toFixed(4) ||
      this.state.region.longitude.toFixed(4) !== region.longitude.toFixed(4)
    ) {
      this.setState({ region })
    }
  }

  /*
  ## pragma mark - Form handlers
   */
  handleScrollToTop = () => this.scrollView.scrollToPosition(0, 0)

  handleScrollToBottom = () => this.scrollView.scrollToEnd()

  handleSubmit = (values, { reset }) => {
    const { properties, editingProperty, region } = this.state

    if (editingProperty) {
      const mutableProperties = cloneDeep(properties)
      const arrIndex = findIndex(mutableProperties, { id: editingProperty.id })
      mutableProperties.splice(arrIndex, 1, {
        id: editingProperty.id,
        name: values.name,
        pic: values.pic,
        location: [region.longitude, region.latitude],
      })
      this.setState(
        { editingProperty: null, properties: mutableProperties },
        this.handleScrollToTop,
      )
    } else {
      const property = {
        id: new Date().valueOf(),
        name: values.name,
        pic: values.pic,
        location: [region.longitude, region.latitude],
      }

      this.setState({ properties: [...properties, property] }, this.handleScrollToTop)
    }

    reset(this.getInitialValues)
  }

  handleSubmitPress = () => {
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

    this.props.navigation.navigate({
      routeName: verification.business,
      params: { properties, businessInfo: this.businessInfo },
    })
  }

  handleEditProperty = (item, form) => {
    const { location } = item
    let { region } = this.state
    region = {
      ...region,
      longitude: Number(location[0]),
      latitude: Number(location[1]),
    }
    this.setState({ region, editingProperty: item })
    form.reset(item)
  }

  handleRemoveProperty = item => {
    const { properties } = this.state
    Alert.alert('Direct Livestock', VerificationMessages.Property_required, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => {
          this.setState({ properties: filter(properties, property => property.id !== item.id) })
        },
      },
    ])
  }

  handleCancelUpdatePress = form => () => {
    this.setState({ editingProperty: null })
    form.reset(this.getInitialValues())
  }

  propertyKeyExtractor = item => item.id

  renderPropertyItem = form => ({ item }) => (
    <PropertyListItem>
      <PropertyView>
        <Title numberOfLines={1}>Name: {item.name}</Title>

        <Title numberOfLines={1}>PIC: {item.pic}</Title>

        <Title numberOfLines={1}>
          Geolocation: {item.location[1].toFixed(4)}, {item.location[0].toFixed(4)}
        </Title>
      </PropertyView>

      <Box>
        <IconButton
          onPress={() => this.handleEditProperty(item, form)}
          iconGlyph={circleEditIcon}
          iconSize={30}
          py={2}
        />

        <IconButton
          onPress={() => this.handleRemoveProperty(item)}
          iconGlyph={circleTrashIcon}
          iconSize={30}
          py={2}
        />
      </Box>
    </PropertyListItem>
  )

  renderForm = ({ handleSubmit, form }) => {
    const { properties, editingProperty, region } = this.state
    const latLngString = region
      ? `${region.latitude}, ${region.longitude}`
      : VerificationTooltips.geolocation

    return (
      <FormInner>
        {properties.length > 0 && (
          <PropertyList
            keyExtractor={this.propertyKeyExtractor}
            data={properties}
            renderItem={this.renderPropertyItem(form)}
            mb={24}
          />
        )}
        <Label mt={-24}>Please Fill In Property Details</Label>
        <FormContent>
          <Field
            name="name"
            component={TextInput}
            keyboardType="default"
            label="Property Name"
            placeholder={VerificationTooltips.propertyName}
            autoCapitalize="words"
          />

          <Separator />

          <Field
            name="pic"
            component={TextInput}
            keyboardType="default"
            label="PIC"
            placeholder={VerificationTooltips.pic}
            autoCapitalize="none"
            onSubmitEditing={this.handleScrollToBottom}
          />

          <Separator />

          <Field
            name="geolocation"
            component={TextInput}
            keyboardType="default"
            label="Geolocation"
            placeholder={latLngString}
            numberOfLines={1}
            editable={false}
          />

          <Separator />

          {region && (
            <MapView
              provider={PROVIDER_GOOGLE}
              region={this.state.region}
              onRegionChangeComplete={this.handleRegionChange}
            >
              <Marker coordinate={region} />
            </MapView>
          )}
        </FormContent>

        <FormFooter>
          {!editingProperty && (
            <Button title="Add Property" onPress={handleSubmit} variant="secondary" />
          )}
          {editingProperty && (
            <Row>
              <Button title="Update" onPress={handleSubmit} mr={6} width={120} />

              <Button
                title="Cancel"
                onPress={this.handleCancelUpdatePress(form)}
                variant="tertiary"
                width={120}
              />
            </Row>
          )}
          <Button title="Submit" onPress={this.handleSubmitPress} isLast />
        </FormFooter>
      </FormInner>
    )
  }

  render() {
    return (
      <Container>
        <Scrollable ref={this.setScrollView}>
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

Property.propTypes = {
  ...ReactNavigationPropTypes,
}

export default Property
