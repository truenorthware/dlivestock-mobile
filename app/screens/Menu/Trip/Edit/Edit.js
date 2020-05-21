import React, { Component } from 'react'
import PT from 'prop-types'

import { Alert } from 'react-native'
import { Form, Field } from 'react-final-form'
import ImageView from 'react-native-image-view'

import get from 'lodash/get'
import clone from 'lodash/clone'

import Promisify from 'utils/promisify'

import { ReactNavigationPropTypes } from 'constants/propTypes'
import { trip as tripRoute } from 'constants/routeNames'
import { add2Icon, trashIcon, eyeIcon } from 'images'

import ValidationService from 'services/validation'
import { TripTooltips } from 'services/tooltips'
import { UserTypes } from 'services/dataTypes'
import {
  TripStatus,
  TripStatusTypes,
  ProducerActionApproval,
  DriverActionComplete,
} from 'services/tripStatusTypes'
import { TripEvents, trackEvent } from 'services/mixpanel'
import { launchPicker } from 'services/photo'

import {
  Container,
  Scrollable,
  FormContent,
  FormInner,
  FormFooter,
  Button,
  Dropdown,
  TextInput,
  TextAreaInput,
  Label,
  Meta,
  Nvds,
  Images,
  Image,
  Loader,
  IconButton,
  CloseButton,
} from './styles'

class EditTrip extends Component {
  constructor(props) {
    super(props)

    this.trip = {}

    this.state = {
      driverLocation: null,
      nvds: [],
      nvdIndex: -1,
      isNvdVisible: false,
    }
  }

  componentDidMount() {
    this.setInitState()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.trips.length !== this.props.trips.length) {
      this.setInitState()
    }
  }

  setInitState = () => {
    this.trip = this.getTrip()
    console.log(this.trip)
    this.setState({
      nvds: this.trip.nvds,
    })

    if (this.props.user.type === UserTypes.Driver) {
      navigator.geolocation.getCurrentPosition(this.getMyLocation)
    }
  }

  getTrip = () => {
    const tripId = +get(this.props, 'navigation.state.params.tripId')
    const { trips, companies, producers } = this.props

    const trip = clone(trips.find(item => item.id === tripId))

    const company = companies.find(item => item.id === trip.companyId)
    const producer = producers.find(item => item.id === trip.producerId)
    const property = producer.properties.find(item => item.id === trip.propertyId)

    trip.company = get(company, 'name', '')
    trip.companyType = get(company, 'type', '')
    trip.producer = get(producer, 'businessName', '')
    trip.property = get(property, 'name')
    trip.statusValue = trip.status
    trip.status = [{ value: trip.status, label: trip.status, extendedLabel: trip.status }]

    return trip
  }

  getMyLocation = ({ coords }) => {
    this.setState({ driverLocation: coords })
  }

  getInitialValues = () => ({
    truckNumber: this.trip.truckNumber,
    cattleCapacity: this.trip.cattleCapacity.toString(),
    company: this.trip.company,
    producer: this.trip.producer,
    property: this.trip.property,
    status: this.trip.status,
    comments: this.trip.comments,
  })

  getTripStatusActions = () => {
    const { user } = this.props
    if (user.type === UserTypes.Driver && this.trip.statusValue === TripStatus.InProgress) {
      return DriverActionComplete
    }
    if (user.type === UserTypes.Producer && this.trip.statusValue === TripStatus.Waiting) {
      return ProducerActionApproval
    }
    return TripStatusTypes
  }

  validate = values => {
    const constraints = {
      truckNumber: {
        presence: {
          message: 'is required',
          allowEmpty: false,
        },
      },
      cattleCapacity: {
        presence: {
          message: 'is required',
          allowEmpty: false,
        },
      },
      company: {
        presence: {
          message: 'is required',
          allowEmpty: false,
        },
      },
      producer: {
        presence: {
          message: 'is required',
          allowEmpty: false,
        },
      },
      property: {
        presence: {
          message: 'is required',
          allowEmpty: false,
        },
      },
      status: {
        presence: {
          message: 'is required',
          allowEmpty: false,
        },
      },
    }

    return ValidationService.validate(constraints, values)
  }

  setLoader = ref => {
    this.loader = ref
  }

  isEditableStatus = () => {
    const { user } = this.props
    const { statusValue } = this.trip

    if (user.type === UserTypes.Driver && statusValue === TripStatus.InProgress) {
      return true
    }

    if (user.type !== UserTypes.Driver) return true

    return false
  }

  handleAddNvds = () => {
    const { nvds } = this.state
    launchPicker({}, response => {
      console.log(response)
      this.setState({ nvds: nvds.concat([response]) })
    })
  }

  handleViewNvd = idx => () => {
    console.log(idx)
    this.setState({ nvdIndex: idx, isNvdVisible: true })
  }

  handleCloseNvd = () => {
    this.setState({ isNvdVisible: false })
  }

  handleRemoveNvd = id => () => {
    const { nvds } = this.state
    this.setState({ nvds: nvds.filter(nvd => nvd.id !== id) })
  }

  handleSubmit = async ({ truckNumber, cattleCapacity, status, comments }) => {
    const { user, onUpdateTrip } = this.props
    const { driverLocation, nvds } = this.state

    this.loader.show()
    try {
      const payload = {
        id: this.trip.id,
        truckNumber,
        cattleCapacity: Number(cattleCapacity),
        status: get(status, '[0].value'),
        files: nvds,
        comments,
      }

      if (user.type === UserTypes.Driver) {
        payload.driverLocation = [driverLocation.longitude, driverLocation.latitude]
      }
      await Promisify(onUpdateTrip, payload)

      const { company, producer, property } = this.trip
      trackEvent(TripEvents.Name, TripEvents.Create, {
        ...payload,
        producer,
        property,
        company,
      })
      Alert.alert('Direct Livestock', 'Trip has been updated successfully', [
        {
          text: 'OK',
          style: 'cancel',
          onPress: this.handleCancelTripPress,
        },
      ])
    } catch (e) {
      Alert.alert('Direct Livestock', e.message, [
        {
          text: 'OK',
          style: 'cancel',
          onPress: () => {
            this.loader.hide()
          },
        },
      ])
    }
  }

  handleCancelTripPress = () => {
    this.loader.hide()
    this.props.navigation.navigate({ routeName: tripRoute.lobby })
  }

  renderForm = ({ handleSubmit }) => {
    const { nvds } = this.state
    const { user } = this.props
    const { statusValue } = this.trip
    const addNvdsEl = nvds.length < 3 && (
      <Meta>
        <IconButton onPress={this.handleAddNvds} iconGlyph={add2Icon} iconSize={100} />
      </Meta>
    )
    const nvdsEl =
      nvds.length > 0 &&
      nvds.map(({ id, source }, idx) => (
        <Meta key={`#nvd-${id}`}>
          <Images>
            <Image source={source} />

            <IconButton
              onPress={this.handleViewNvd(idx)}
              iconGlyph={eyeIcon}
              iconTintColor="white"
              iconSize={30}
              mx={2}
            />

            <IconButton
              onPress={this.handleRemoveNvd(id)}
              iconGlyph={trashIcon}
              iconTintColor="white"
              iconSize={30}
              mx={2}
            />
          </Images>
        </Meta>
      ))

    const destinationType = this.trip.companyType

    return (
      <FormInner>
        <FormContent>
          <Label mt={-24}>Truck information</Label>

          <Field
            name="truckNumber"
            component={TextInput}
            keyboardType="default"
            label="Truck Plate Number"
            placeholder={TripTooltips.number}
            autoCapitalize="characters"
            disabled={user.type !== UserTypes.Driver || statusValue !== TripStatus.Waiting}
          />

          <Field
            name="cattleCapacity"
            component={TextInput}
            keyboardType="numeric"
            label="Number of Head"
            placeholder={TripTooltips.cattle}
            disabled={user.type !== UserTypes.Driver || statusValue !== TripStatus.Waiting}
          />

          <Field
            name="status"
            component={Dropdown}
            label="Status"
            placeholder={TripTooltips.status}
            options={this.getTripStatusActions()}
            editable={this.isEditableStatus()}
            isDisabled={!this.isEditableStatus()}
          />

          <Field
            name="comments"
            component={TextAreaInput}
            label="Comments"
            placeholder={TripTooltips.comments}
            autoCapitalize="sentences"
          />

          <Label mt={24}>Source Location</Label>

          <Field
            name="producer"
            component={TextInput}
            label="Producer"
            placeholder={TripTooltips.producer}
            disabled
          />

          <Field
            name="property"
            component={TextInput}
            label="Property"
            placeholder={TripTooltips.property}
            disabled
          />

          <Label>Destination</Label>

          <TextInput
            label="Select Destination Type"
            input={{
              value: destinationType,
              onChange: null,
            }}
            disabled
          />

          <Field
            name="company"
            component={TextInput}
            label="Select Destination"
            placeholder={TripTooltips.company}
            disabled
          />

          <Label>National Vendor Declaration</Label>

          <Nvds>
            {addNvdsEl}
            {nvdsEl}
          </Nvds>
        </FormContent>
        <FormFooter>
          <Button title="Update trip" onPress={handleSubmit} mx={-40} />

          <Button title="Cancel" onPress={this.handleCancelTripPress} variant="tertiary" mx={-40} />
        </FormFooter>
      </FormInner>
    )
  }

  render() {
    const { nvds, nvdIndex, isNvdVisible } = this.state

    if (!this.trip.id) {
      return (
        <Container>
          <Loader />
        </Container>
      )
    }

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

        <ImageView
          glideAlways
          images={nvds}
          imageIndex={nvdIndex}
          isVisible={isNvdVisible}
          onClose={this.handleCloseNvd}
          controls={{
            close: CloseButton,
          }}
        />

        <Loader ref={this.setLoader} />
      </Container>
    )
  }
}

EditTrip.propTypes = {
  ...ReactNavigationPropTypes,
  companies: PT.array.isRequired,
  producers: PT.array.isRequired,
  trips: PT.array.isRequired,
  user: PT.object.isRequired,
  onUpdateTrip: PT.func.isRequired,
}

export default EditTrip
