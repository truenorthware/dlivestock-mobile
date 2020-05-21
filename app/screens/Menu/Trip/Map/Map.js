import React, { Component } from 'react'
import PT from 'prop-types'

import { Platform, Dimensions, Alert } from 'react-native'

import Secrets from 'react-native-config'

import { PROVIDER_GOOGLE, AnimatedRegion } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'

import get from 'lodash/get'
import delay from 'lodash/delay'
import noop from 'lodash/noop'

import Promisify from 'utils/promisify'

import { TripStatus } from 'services/tripStatusTypes'
import { getDistanceFrom2LatLng } from 'services/api/googleApi'
import { initializeSocket, emitLocation, angleFromCoordinate } from 'services/api/handlers/location'
import { TripEvents, trackEvent } from 'services/mixpanel'

import { ReactNavigationPropTypes } from 'constants/propTypes'
import { trip as tripRoute } from 'constants/routeNames'

import {
  Container,
  Button,
  SpritButton,
  SpritIcon,
  MapView,
  MarkerOrigin,
  MarkerDestination,
  AnimateMarker,
  MapUtil,
  MenuButton,
  Input,
  Meta,
  Modal,
  Sheet,
} from './styles'

const windowDimens = Dimensions.get('window')

const EMIT_INTERVAL = 1000 * 60 /* every 1 min(s) */

class Map extends Component {
  constructor(props) {
    super(props)

    const tripId = get(props, 'navigation.state.params.tripId')
    this.trip = props.trips.find(item => item.id === tripId)

    this.state = {
      originDirection: this.getDriverCoordinate(),
      coordinate: new AnimatedRegion({
        ...this.getDriverCoordinate(),
        latitudeDelta: 0.01,
        longitudeDelta: 0.01 * (windowDimens.width / windowDimens.height),
        heading: 0,
      }),
      actionType: -1,
      comments: '',
      coords: [],
      nearOrigin: this.getDriverCoordinate(),
      nearDestination: this.getDestinationCoordinate(),
    }

    this.region = {
      ...this.getDriverCoordinate(),
      latitudeDelta: 0.01,
      longitudeDelta: 0.01 * (windowDimens.width / windowDimens.height),
    }

    this.mapView = null
    this.marker = null
    this.watchLocationId = null
    this.lastDriverLocation = this.getDriverCoordinate()

    initializeSocket(props.getJWTHeader)
  }

  componentDidMount() {
    this.watchLocationId = navigator.geolocation.watchPosition(this.getMyLocation, noop)
    this.watchLocationTimerId = delay(this.emitDriverLocation, EMIT_INTERVAL)
    this.getPoints()
  }

  componentWillUnmount() {
    if (this.watchLocationId) {
      navigator.geolocation.clearWatch(this.watchLocationId)
    }

    if (this.watchLocationTimerId) {
      clearTimeout(this.watchLocationTimerId)
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

  getMyLocation = ({ coords }) => {
    const { coordinate } = this.state
    const { id, driverId, producerId, propertyId, companyId } = this.trip

    if (
      this.lastDriverLocation.latitude === coords.latitude &&
      this.lastDriverLocation.longitude === coords.longitude
    ) {
      return
    }

    const newCoordinate = {
      latitude: coords.latitude,
      longitude: coords.longitude,
    }
    if (this.lastDriverLocation) {
      const heading = angleFromCoordinate(
        this.lastDriverLocation.latitude,
        this.lastDriverLocation.longitude,
        coords.latitude,
        coords.longitude,
      )
      console.log('angle:', heading)
      this.setState({ heading })
    }
    this.lastDriverLocation = newCoordinate

    this.setState({ originDirection: newCoordinate })

    emitLocation({
      ...this.lastDriverLocation,
      tripId: id,
      driverId,
      producerId,
      propertyId,
      companyId,
      isDbUpdate: false,
    })

    // Animate Marker to driver's new location
    if (Platform.OS === 'android') {
      const markerComponent = get(this.marker, '_component')
      if (markerComponent) {
        markerComponent.animateMarkerToCoordinate(newCoordinate, 500)
      }
    } else {
      coordinate.timing(newCoordinate).start()
    }

    // Animate MapView to driver's new location
    if (this.mapView) {
      this.mapView.animateToRegion({ ...this.region, ...newCoordinate }, 500)
    }
  }

  emitDriverLocation = () => {
    const { id, name, driverId, producerId, propertyId, companyId } = this.trip
    const originLatLng = this.getOriginCoordinate()
    const destinationLatLng = this.getDestinationCoordinate()

    if (this.trip.status === TripStatus.InProgress) {
      const driverLocation = this.state.driverLocation || {
        latitude: this.lastDriverLocation.latitude,
        longitude: this.lastDriverLocation.longitude,
      }
      const distance = getDistanceFrom2LatLng(driverLocation, {
        longitude: Number(get(this.trip, 'destination.coordinates[0]')),
        latitude: Number(get(this.trip, 'destination.coordinates[1]')),
      })

      if (distance < 500 /* 500 meters */) {
        this.handleCompleteTrip().then()
      }
    }

    emitLocation({
      ...this.lastDriverLocation,
      tripId: id,
      driverId,
      producerId,
      propertyId,
      companyId,
      isDbUpdate: true,
    })

    trackEvent(TripEvents.Name, TripEvents.UpdateDriverLocation, {
      id,
      name,
      origin: `${originLatLng.latitude}, ${originLatLng.longitude}`,
      destination: `${destinationLatLng.latitude}, ${destinationLatLng.longitude}`,
      driverLocation: `${this.lastDriverLocation.latitude}, ${this.lastDriverLocation.longitude}`,
    })

    this.watchLocationTimerId = delay(this.emitDriverLocation, EMIT_INTERVAL)
  }

  getTitle = () => {
    const { producers, companies } = this.props
    const { producerId, companyId } = this.trip

    const producer = producers.find(item => item.id === producerId)
    const company = companies.find(item => item.id === companyId)

    return `Trip from ${get(producer, 'businessName', '')} to ${get(company, 'name', '')}`
  }

  handleRegionChange = region => {
    const { originDirection } = this.state
    const destination = this.getDestinationCoordinate()
    this.region = region

    const { coords } = this.state
    const deltaLimit = 0.4
    if (region.latitudeDelta < deltaLimit && coords.length) {
      let i
      let j
      const latDelta = deltaLimit
      const lngDelta = latDelta * (windowDimens.width / windowDimens.height)
      for (i = 0; i < coords.length - 1 - 1; i += 1) {
        const { latitude, longitude } = coords[i]
        if (
          latitude > region.latitude - latDelta &&
          latitude < region.latitude + latDelta &&
          longitude > region.longitude - lngDelta &&
          longitude < region.longitude + lngDelta
        ) {
          break
        }
      }
      for (j = coords.length - 1; j >= 1; j -= 1) {
        const { latitude, longitude } = coords[j]
        if (
          latitude > region.latitude - latDelta &&
          latitude < region.latitude + latDelta &&
          longitude > region.longitude - lngDelta &&
          longitude < region.longitude + lngDelta
        ) {
          break
        }
      }

      this.setState({
        nearOrigin: coords[i],
        nearDestination: coords[j],
      })
    } else {
      this.setState({
        nearOrigin: originDirection,
        nearDestination: destination,
      })
    }
  }

  handleTruckButtonPress = () => {
    this.mapView.animateToRegion({
      ...this.region,
      ...this.lastDriverLocation,
    })
  }

  handleMenuPress = () => {
    this.sheetRef.show()
  }

  handleClosePress = () => {
    this.props.navigation.goBack()
  }

  handleViewDetail = () => {
    this.props.navigation.navigate({
      routeName: tripRoute.detail,
      params: { tripId: this.trip.id },
    })
  }

  handleOpenCancelComment = () => {
    setTimeout(() => {
      this.setState({ actionType: 0 }, () => this.commentModal.show())
    }, 450)
  }

  handleOpenReportComment = () => {
    setTimeout(() => {
      this.setState({ actionType: 1 }, () => this.commentModal.show())
    }, 450)
  }

  handleCloseCommentModal = () => this.commentModal.hide()

  handleSubmitCommentModal = async () => {
    const { onUpdateTrip } = this.props
    const { comments, actionType } = this.state

    const payload = {
      id: this.trip.id,
    }

    if (comments) {
      payload.comments = comments
    }

    if (actionType === 0) {
      payload.status = TripStatus.Cancelled
    } else {
      payload.status = TripStatus.InProgress
    }

    try {
      this.commentModal.hide()
      await Promisify(onUpdateTrip, payload)

      if (actionType === 0) {
        this.props.navigation.goBack()
      }
    } catch (e) {
      Alert.alert('Direct Livestock', e.message, [
        {
          text: 'OK',
          style: 'cancel',
        },
      ])
    }
  }

  handleCompleteTrip = () => async () => {
    const { id, name } = this.trip
    const { onUpdateTrip, navigation } = this.props
    const { driverLocation } = this.state
    const payload = {
      id,
      status: TripStatus.Completed,
    }

    try {
      this.loader.show()
      await Promisify(onUpdateTrip, payload)
      trackEvent(TripEvents.Name, TripEvents.Complete, {
        ...payload,
        name,
        driverLocation: driverLocation
          ? `${driverLocation.latitude}, ${driverLocation.longitude}`
          : null,
      })
      Alert.alert('Direct Livestock', 'The trip has been completed', [
        {
          text: 'OK',
          style: 'cancel',
          onPress: navigation.goBack,
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

  handleCommentChange = comments => {
    this.setState({ comments })
  }

  setMapView = ref => {
    this.mapView = ref
  }

  setMarker = ref => {
    this.marker = ref
  }

  setCommentModal = ref => {
    this.commentModal = ref
  }

  handleSheetRef = ref => {
    this.sheetRef = ref
  }

  getPoints = () => {
    const mode = 'driving'
    const { originDirection } = this.state
    const destination = this.getDestinationCoordinate()
    const APIKEY = Secrets.GOOGLE_API_KEY
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${
      originDirection.latitude
    },${originDirection.longitude}&destination=${destination.latitude},${
      destination.longitude
    }&key=${APIKEY}&mode=${mode}`

    fetch(url)
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.routes.length) {
          /*eslint-disable */
          const decode = (t, e) => {for(var n,o,u=0,l=0,r=0,d= [],h=0,i=0,a=null,c=Math.pow(10,e||5);u<t.length;){a=null,h=0,i=0;do a=t.charCodeAt(u++)-63,i|=(31&a)<<h,h+=5;while(a>=32);n=1&i?~(i>>1):i>>1,h=i=0;do a=t.charCodeAt(u++)-63,i|=(31&a)<<h,h+=5;while(a>=32);o=1&i?~(i>>1):i>>1,l+=n,r+=o,d.push([l/c,r/c])}return d=d.map(function(t){return{latitude:t[0],longitude:t[1]}})}
          /* eslint-enable */
          this.setState({
            coords: decode(responseJson.routes[0].overview_polyline.points),
          })
        }
      })
      .catch(e => {
        console.warn(e)
      })
  }

  render() {
    const { coordinate, nearOrigin, nearDestination, heading } = this.state

    const modalContent = (
      <Input placeholder="Comments" onChangeText={this.handleCommentChange} multiline />
    )

    const modalFooter = (
      <Meta>
        <Button title="Submit" onPress={this.handleSubmitCommentModal} mx={3} width={120} />

        <Button
          variant="secondary"
          title="Cancel"
          onPress={this.handleCloseCommentModal}
          mx={3}
          width={120}
        />
      </Meta>
    )

    const spritIcon = <SpritIcon />

    const burgerOptions = [
      {
        value: 1,
        extendedLabel: 'View Details',
        callback: this.handleViewDetail,
      },
      {
        value: 2,
        extendedLabel: 'Report Incident',
        callback: this.handleOpenReportComment,
      },
      {
        value: 3,
        extendedLabel: 'Cancel Trip',
        callback: this.handleOpenCancelComment,
      },
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
          <AnimateMarker ref={this.setMarker} coordinate={coordinate} heading={heading} />

          <MarkerOrigin coordinate={this.getOriginCoordinate()} />

          <MarkerDestination coordinate={this.getDestinationCoordinate()} />

          <MapViewDirections
            origin={nearOrigin}
            destination={nearDestination}
            apikey={Secrets.GOOGLE_API_KEY}
            strokeWidth={8}
            strokeColor="#6db3f2"
            optimizeWaypoints
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

        <Modal
          ref={this.setCommentModal}
          title="Please input comment"
          contentComponent={modalContent}
          footerComponent={modalFooter}
        />
      </Container>
    )
  }
}

Map.propTypes = {
  ...ReactNavigationPropTypes,
  companies: PT.array.isRequired,
  getJWTHeader: PT.string.isRequired,
  producers: PT.array.isRequired,
  trips: PT.array.isRequired,
  onUpdateTrip: PT.func.isRequired,
}

export default Map
