import React, { Component } from 'react'
import PT from 'prop-types'

import { Alert } from 'react-native'

import get from 'lodash/get'
import moment from 'moment'
import Secrets from 'react-native-config'

import { PROVIDER_GOOGLE } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'

import { TripStatus } from 'services/tripStatusTypes'
import { getDirectionInfoFrom2LatLng } from 'services/api/googleApi'
import { ReactNavigationPropTypes } from 'constants/propTypes'

import { dotIcon } from 'images'

import {
  Loader,
  Container,
  Button,
  Modal,
  Scrollable,
  WhiteBg,
  DrawerItem,
  Flex1,
  MapView,
  MarkerOrigin,
  MarkerDestination,
  MarkerDriver,
  Meta,
  MetaIconView,
  Icon,
  Text,
  Drawer,
  Br,
} from './styles'

class ViewMap extends Component {
  constructor(props) {
    super(props)

    this.state = {
      trips: [],
      modalContent: <Text>No Info</Text>,
    }

    this.initialTrip = {
      company: {
        position: { coordinates: [146.0128, -27.249] },
      },
      property: {
        position: { coordinates: [146.0128, -27.249] },
      },
    }
    this.mapInitialRegion = {
      ...this.getCompanyCoordinate(this.props.trips[0] || this.initialTrip),
      latitudeDelta: 1,
      longitudeDelta: 1,
    }
  }

  async componentDidMount() {
    this.loader.show()

    try {
      const trip = this.props.trips[0] || this.initialTrip
      this.setInitialState()
      const { center, delta } = await getDirectionInfoFrom2LatLng(
        this.getPropertyCoordinate(trip),
        this.getCompanyCoordinate(trip),
      )

      this.mapInitialRegion = {
        ...center,
        latitudeDelta: delta,
        longitudeDelta: delta,
      }

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

  setInitialState = () => {
    const propsTrips = this.props.trips.filter(
      trip =>
        trip.status === TripStatus.InProgress ||
        (trip.status === TripStatus.Approved &&
          moment(trip.updatedAt).format('MM-DD-YYYY') === moment().format('MM-DD-YYYY')),
    )
    Promise.all(
      propsTrips.map(trip =>
        getDirectionInfoFrom2LatLng(
          this.getPropertyCoordinate(trip),
          this.getCompanyCoordinate(trip),
        ),
      ),
    ).then(responses => {
      const trips = propsTrips.map((trip, i) => ({ ...trip, ...responses[i] }))
      this.setState({ trips })
    })
  }

  getOriginCoordinate = trip => ({
    longitude: get(trip, 'origin.coordinates[0]'),
    latitude: get(trip, 'origin.coordinates[1]'),
  })

  getPropertyCoordinate = trip => ({
    longitude: get(trip, 'property.position.coordinates[0]'),
    latitude: get(trip, 'property.position.coordinates[1]'),
  })

  getDestinationCoordinate = trip => ({
    longitude: get(trip, 'destination.coordinates[0]'),
    latitude: get(trip, 'destination.coordinates[1]'),
  })

  getCompanyCoordinate = trip => ({
    longitude: get(trip, 'company.position.coordinates[0]'),
    latitude: get(trip, 'company.position.coordinates[1]'),
  })

  getDriverCoordinate = trip => ({
    longitude: get(trip, 'driverLocation.coordinates[0]'),
    latitude: get(trip, 'driverLocation.coordinates[1]'),
  })

  getStatusColor = status => {
    switch (status) {
      case TripStatus.Rejected:
      case TripStatus.Aborted:
      case TripStatus.Cancelled:
        return 'lightRed'

      case TripStatus.Completed:
      case TripStatus.Approved:
        return 'appleGreen'

      case TripStatus.Waiting:
      case TripStatus.InProgress:
        return 'lightBlue'

      default:
        return 'lightBlue'
    }
  }

  handleOpenModal = trip => {
    const modalContent = [
      <Text key="1">
        <Text fontWeight={800}>Producer Name:</Text> {get(trip, 'producer.firstName')}{' '}
        {get(trip, 'producer.lastName')}
      </Text>,
      <Text key="2">
        <Text fontWeight={800}>Distance to Processor:</Text> {get(trip, 'distance')}
      </Text>,
      <Text key="3">
        <Text fontWeight={800}>Driver Name:</Text> {get(trip, 'driver.firstName')}{' '}
        {get(trip, 'driver.lastName')}
      </Text>,
      <Text key="4">
        <Text fontWeight={800}>Phone Number:</Text> {get(trip, 'driver.phoneNumber')}
      </Text>,
      <Text key="5">
        <Text fontWeight={800}>Status:</Text> {get(trip, 'status')}
      </Text>,
    ]
    this.setState({ modalContent }, () => this.tripInfoModal.show())
  }

  handleCloseModal = () => this.tripInfoModal.hide()

  setTripInfoModal = ref => {
    this.tripInfoModal = ref
  }

  setLoader = ref => {
    this.loader = ref
  }

  render() {
    const { trips } = this.state
    const dateTrips = this.props.trips.filter(
      trip => moment(trip.updatedAt).format('MM-DD-YYYY') === moment().format('MM-DD-YYYY'),
    )

    let drawerContent = [
      <Text key="header" fontSize={2} fontWeight={800} mx={4} mt={4}>
        Date Producer
      </Text>,
    ]

    if (dateTrips.length > 0) {
      drawerContent = drawerContent.concat(
        dateTrips.map(trip => (
          <DrawerItem key={trip.id}>
            <Flex1 mr={2}>
              <Text lineHeight={1} numberOfLines={1}>
                {get(trip, 'producer.businessName')}
              </Text>
            </Flex1>
            <Icon glyph={dotIcon} tintColor={this.getStatusColor(trip.status)} />
          </DrawerItem>
        )),
      )
    } else {
      drawerContent.push(
        <Text mx={4} mt={4} key="no-content">
          No Date Trip
        </Text>,
      )
    }

    const destinationMarkerEl = trips.length > 0 && (
      <MarkerDestination coordinate={this.getCompanyCoordinate(trips[0])} />
    )
    const colors = ['#00f', '#0f0', '#f00', '#ff0', '#f0f']
    const mapEl = (
      <MapView provider={PROVIDER_GOOGLE} initialRegion={this.mapInitialRegion}>
        {destinationMarkerEl}
        {trips.map((trip, i) => [
          <MarkerOrigin
            coordinate={this.getPropertyCoordinate(trip)}
            key={i * 2}
            onPress={() => this.handleOpenModal(trip)}
          />,

          <MapViewDirections
            key={i * 2 + 1}
            origin={this.getPropertyCoordinate(trip)}
            destination={this.getCompanyCoordinate(trip)}
            apikey={Secrets.GOOGLE_API_KEY}
            strokeWidth={8}
            strokeColor={colors[i]}
          />,
        ])}
      </MapView>
    )

    const modalFooter = (
      <Meta>
        <Button
          variant="tertiary"
          title="Close"
          onPress={this.handleCloseModal}
          width={120}
          isLast
        />
      </Meta>
    )

    return (
      <Drawer
        content={drawerContent}
        open={this.props.isOpenedDrawer}
        onClose={() => this.props.onOpenDrawer(false)}
        tweenHandler={ratio => ({
          mainOverlay: {
            opacity: ratio / 2,
          },
        })}
      >
        <Container>
          {mapEl}
          <Modal
            ref={this.setTripInfoModal}
            title="Trip Info"
            contentComponent={this.state.modalContent}
            footerComponent={modalFooter}
          />
          <Loader ref={this.setLoader} />
        </Container>
      </Drawer>
    )
  }
}

ViewMap.propTypes = {
  ...ReactNavigationPropTypes,
}

export default ViewMap
