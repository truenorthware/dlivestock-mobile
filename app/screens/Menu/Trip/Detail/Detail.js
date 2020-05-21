import React, { Component } from 'react'
import PT from 'prop-types'

import { Alert } from 'react-native'

import get from 'lodash/get'
import moment from 'moment'
import Secrets from 'react-native-config'

import { PROVIDER_GOOGLE } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'

import {
  cattleIcon,
  companyIcon,
  distanceIcon,
  locationIcon,
  statusIcon,
  phoneIcon,
  userIcon,
  timeIcon,
  truckIcon,
} from 'images'

import Promisify from 'utils/promisify'
import { getDirectionInfoFrom2LatLng } from 'services/api/googleApi'
import { ReactNavigationPropTypes } from 'constants/propTypes'

import {
  Loader,
  Container,
  Scrollable,
  WhiteBg,
  MapView,
  MarkerOrigin,
  MarkerDestination,
  MarkerDriver,
  Meta,
  MetaIconView,
  Icon,
  Text,
  Br,
} from './styles'

class Detail extends Component {
  constructor(props) {
    super(props)

    this.state = {
      distance: 0,
    }

    this.trip = null
    this.mapInitialRegion = null
  }

  async componentDidMount() {
    const tripId = get(this.props, 'navigation.state.params.tripId')

    this.loader.show()

    try {
      this.trip = await Promisify(this.props.onGetTrip, tripId)
      const { distance, center, delta } = await getDirectionInfoFrom2LatLng(
        this.getDriverCoordinate(),
        this.getDestinationCoordinate(),
      )

      this.mapInitialRegion = {
        ...center,
        latitudeDelta: delta,
        longitudeDelta: delta,
      }

      this.setState({ distance })
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

  /*
  ## pragma mark - Location & Map & Marker event handlers
   */

  getOriginCoordinate = () => ({
    longitude: get(this.trip, 'origin.coordinates[0]'),
    latitude: get(this.trip, 'origin.coordinates[1]'),
  })

  getDestinationCoordinate = () => ({
    longitude: get(this.trip, 'destination.coordinates[0]'),
    latitude: get(this.trip, 'destination.coordinates[1]'),
  })

  getDriverCoordinate = () => ({
    longitude: get(this.trip, 'driverLocation.coordinates[0]'),
    latitude: get(this.trip, 'driverLocation.coordinates[1]'),
  })

  getProperty = () => {
    const { producer, propertyId } = this.trip
    const { properties } = producer

    const property = properties.find(item => item.id === propertyId)

    return {
      name: property.name,
      pic: property.pic,
    }
  }

  getFreightName = () => get(this.state, 'trip.driver.freightDetail.name')

  getStatusColor = status => {
    switch (status) {
      case 'Completed':
        return 'appleGreen'

      default:
        return 'lightRed'
    }
  }

  setLoader = ref => {
    this.loader = ref
  }

  renderDetails = () => {
    const { driver, cattleCapacity, status, company, truckNumber, updatedAt } = this.trip
    const { distance } = this.state
    const property = this.getProperty()

    return (
      <Container>
        <Scrollable>
          <WhiteBg>
            <Meta>
              <MetaIconView isFirst>
                <Icon glyph={locationIcon} />
              </MetaIconView>

              <Text fontSize={1} color="dustyGray" mt={4}>
                From: {property.name}, PIC: {property.pic}
              </Text>
            </Meta>

            <Meta>
              <MetaIconView>
                <Icon glyph={locationIcon} />
              </MetaIconView>

              <Text fontSize={1} color="dustyGray">
                To: {company.name}
              </Text>
            </Meta>

            <Meta>
              <MetaIconView isLast>
                <Icon glyph={cattleIcon} />
              </MetaIconView>

              <Text fontSize={1} color="dustyGray" mb={4}>
                {cattleCapacity} Heads
              </Text>
            </Meta>

            <Br />

            <Meta>
              <MetaIconView isFirst>
                <Icon glyph={companyIcon} />
              </MetaIconView>

              <Text fontSize={1} color="dustyGray" mt={4}>
                {this.getFreightName()}
              </Text>
            </Meta>

            <Meta>
              <MetaIconView>
                <Icon glyph={userIcon} />
              </MetaIconView>

              <Text fontSize={1} color="dustyGray">
                {driver.firstName} {driver.lastName}
              </Text>
            </Meta>

            <Meta>
              <MetaIconView>
                <Icon glyph={phoneIcon} />
              </MetaIconView>

              <Text fontSize={1} color="dustyGray">
                {driver.phoneNumber}
              </Text>
            </Meta>

            <Meta>
              <MetaIconView isLast>
                <Icon glyph={truckIcon} />
              </MetaIconView>

              <Text fontSize={1} color="dustyGray" mb={4}>
                {truckNumber}
              </Text>
            </Meta>

            <Br />

            <Meta>
              <MetaIconView isFirst>
                <Icon glyph={timeIcon} />
              </MetaIconView>

              <Text fontSize={1} color="dustyGray" mt={4}>
                {status}: {moment(updatedAt).format('LLL')}
              </Text>
            </Meta>

            <Meta>
              <MetaIconView>
                <Icon glyph={distanceIcon} />
              </MetaIconView>

              <Text fontSize={1} color="dustyGray">
                Distance: {distance}
              </Text>
            </Meta>

            <Meta>
              <MetaIconView isLast>
                <Icon glyph={statusIcon} />
              </MetaIconView>

              <Text fontSize={1} color={this.getStatusColor(status)} mb={4}>
                {status}
              </Text>
            </Meta>
          </WhiteBg>
        </Scrollable>
      </Container>
    )
  }

  render() {
    const { trip } = this
    const mapEl = trip && (
      <MapView provider={PROVIDER_GOOGLE} initialRegion={this.mapInitialRegion}>
        <MarkerDriver coordinate={this.getDriverCoordinate()} />

        <MarkerOrigin coordinate={this.getOriginCoordinate()} />

        <MarkerDestination coordinate={this.getDestinationCoordinate()} />

        <MapViewDirections
          origin={this.getDriverCoordinate()}
          destination={this.getDestinationCoordinate()}
          apikey={Secrets.GOOGLE_API_KEY}
          strokeWidth={8}
          strokeColor="#6db3f2"
        />
      </MapView>
    )

    return (
      <Container>
        {mapEl}

        {trip && this.renderDetails()}

        <Loader ref={this.setLoader} />
      </Container>
    )
  }
}

Detail.propTypes = {
  ...ReactNavigationPropTypes,
  onGetTrip: PT.func.isRequired,
}

export default Detail
