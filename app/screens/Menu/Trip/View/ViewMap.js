import React, { Component } from 'react'
import PT from 'prop-types'

import { Dimensions, Platform } from 'react-native'

import Secrets from 'react-native-config'

import { PROVIDER_GOOGLE, AnimatedRegion } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'

import get from 'lodash/get'
import { Loader } from 'components/ui'
import { initializeSocket } from 'services/api/handlers/location'

import { ReactNavigationPropTypes } from 'constants/propTypes'

import {
  Container,
  MapView,
  MarkerOrigin,
  MarkerDestination,
  AnimateMarker,
  SpritButton,
  SpritIcon,
  MapUtil,
  MenuButton,
  Sheet,
} from '../Map/styles'

const { width, height } = Dimensions.get('window')

class ViewMap extends Component {
  constructor(props) {
    super(props)

    const tripId = get(props, 'navigation.state.params.tripId')
    this.trip = props.trips.find(item => item.id === +tripId) || {}

    this.state = {
      coordinate: {},
      originDirection: {},
    }

    this.region = {}

    this.mapView = null
    this.marker = null

    this.socket = initializeSocket(props.getJWTHeader)
  }

  componentDidMount() {
    this.setInitState()
  }

  componentWillReceiveProps(nextProps) {
    if (!this.trip.id && nextProps.trips.length) {
      const tripId = get(nextProps, 'navigation.state.params.tripId')
      this.trip = nextProps.trips.find(item => item.id === +tripId)
      this.setInitState()
    }
  }

  componentWillUnmount() {
    this.socket.off(`syncDriverToTrip-${this.trip.id}`, this.updateDriverLocation)
  }

  setInitState = () => {
    let coordinate
    if (this.trip.driverLocation) {
      coordinate = this.getDriverCoordinate()
    } else {
      coordinate = this.getOriginCoordinate()
    }
    this.setState({
      coordinate: new AnimatedRegion({
        ...coordinate,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01 * (width / height),
      }),
      originDirection: coordinate,
    })

    this.region = {
      ...coordinate,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01 * (width / height),
    }

    if (this.trip.id) {
      this.socket.on(`syncDriverToTrip-${this.trip.id}`, this.updateDriverLocation)
    }
  }

  /*
  ## pragma mark - Location & Map & Marker event handlers
   */
  updateDriverLocation = ({ latitude, longitude }) => {
    console.log('UPDATE LOCATION SYNC FROM SOCKET: latitude:', latitude, 'longitude', longitude)
    const { coordinate } = this.state
    const newCoordinate = {
      latitude,
      longitude,
    }

    // Animate Marker to driver's new location
    if (Platform.OS === 'android') {
      const markerComponent = get(this.marker, '_component')
      if (markerComponent) {
        markerComponent.animateMarkerToCoordinate(newCoordinate, 500)
      }
    } else {
      coordinate.timing(newCoordinate).start()
    }

    this.setState({ originDirection: newCoordinate })

    if (this.mapView) {
      this.mapView.animateToRegion({ ...this.region, ...newCoordinate }, 500)
    }
  }

  getOriginCoordinate = () => ({
    longitude: get(this.trip, 'origin.coordinates[0]'),
    latitude: get(this.trip, 'origin.coordinates[1]'),
  })

  getPropertyCoordinate = () => ({
    longitude: get(this.trip, 'property.position.coordinates[0]'),
    latitude: get(this.trip, 'property.position.coordinates[1]'),
  })

  getDestinationCoordinate = () => ({
    longitude: get(this.trip, 'destination.coordinates[0]'),
    latitude: get(this.trip, 'destination.coordinates[1]'),
  })

  getCompanyCoordinate = () => ({
    longitude: get(this.trip, 'company.position.coordinates[0]'),
    latitude: get(this.trip, 'company.position.coordinates[1]'),
  })

  getDriverCoordinate = () => ({
    longitude: get(this.trip, 'driverLocation.coordinates[0]'),
    latitude: get(this.trip, 'driverLocation.coordinates[1]'),
  })

  getTitle = () => {
    const { producers = [], companies } = this.props
    const { producerId, companyId } = this.trip

    const producer = producers.find(item => item.id === producerId)
    const company = companies.find(item => item.id === companyId)

    return `Trip from ${get(producer, 'businessName', '')} to ${get(company, 'name', '')}`
  }

  handleRegionChange = region => {
    this.region = region
  }

  handleTruckButtonPress = () => {
    const { originDirection } = this.state
    this.mapView.animateToRegion({
      ...this.region,
      ...originDirection,
    })
  }

  handleMenuPress = () => {
    console.log('Menu button Pressed')
    this.sheetRef.show()
  }

  handleClosePress = () => {
    this.props.navigation.goBack()
  }

  setMapView = ref => {
    this.mapView = ref
  }

  setMarker = ref => {
    this.marker = ref
  }

  handleSheetRef = ref => {
    this.sheetRef = ref
  }

  render() {
    const { coordinate, originDirection } = this.state

    const spritIcon = <SpritIcon />

    if (!this.trip.id) {
      return (
        <Container>
          <Loader />
        </Container>
      )
    }

    const burgerOptions = [
      {
        value: 4,
        extendedLabel: 'Exit',
        callback: this.handleClosePress,
      },
    ]

    return (
      <Container>
        <MapView
          ref={this.setMapView}
          provider={PROVIDER_GOOGLE}
          initialRegion={this.region}
          onRegionChangeComplete={this.handleRegionChange}
        >
          {this.trip.driverLocation && <AnimateMarker ref={this.setMarker} coordinate={coordinate} />}

          <MarkerOrigin coordinate={this.getOriginCoordinate()} />

          <MarkerDestination coordinate={this.getDestinationCoordinate()} />

          <MapViewDirections
            origin={originDirection}
            destination={this.getDestinationCoordinate()}
            apikey={Secrets.GOOGLE_API_KEY}
            strokeWidth={8}
            strokeColor="#6db3f2"
          />
        </MapView>

        <SpritButton
          variant="tertiary"
          iconLeft={spritIcon}
          onPress={this.handleTruckButtonPress}
        />

        <MapUtil>
          <MenuButton onPress={this.handleMenuPress} />

          <Sheet
            ref={this.handleSheetRef}
            title={this.getTitle()}
            options={burgerOptions}
            selectedOptions={[]}
            onChange={e => e[0].callback()}
          />
        </MapUtil>
      </Container>
    )
  }
}

ViewMap.propTypes = {
  ...ReactNavigationPropTypes,
  companies: PT.array.isRequired,
  getJWTHeader: PT.string.isRequired,
  producers: PT.array.isRequired,
  trips: PT.array.isRequired,
}

export default ViewMap
