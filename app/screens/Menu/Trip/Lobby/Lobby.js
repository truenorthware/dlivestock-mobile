import React, { Component } from 'react'
import moment from 'moment'
import PT from 'prop-types'

import { Alert, Animated, Easing, BackHandler } from 'react-native'
import DatePicker from 'react-native-datepicker'
import { Form, Field } from 'react-final-form'
import ImageView from 'react-native-image-view'

import get from 'lodash/get'
import noop from 'lodash/noop'

import Promisify from 'utils/promisify'

import {
  attachmentIcon,
  cattleIcon,
  eyeIcon,
  eye2Icon,
  dotIcon,
  calendarIcon,
  statusIcon,
  truckIcon,
  userIcon,
  phoneIcon,
  add2Icon,
  trashIcon,
} from 'images'

import { UserTypes } from 'services/dataTypes'
import ValidationService from 'services/validation'
import { TripTooltips } from 'services/tooltips'
import { TripStatus } from 'services/tripStatusTypes'
import { requestLocationPermission } from 'services/location'
import { getLngLatFromAddress, getDistanceFrom2LatLng } from 'services/api/googleApi'
import { TripEvents, trackEvent } from 'services/mixpanel'
import { launchPicker } from 'services/photo'

import { ReactNavigationPropTypes } from 'constants/propTypes'
import { trip as tripRoute } from 'constants/routeNames'

import {
  Container,
  Scrollable,
  Loader,
  CenterContent,
  FormContent,
  FormInner,
  FormFooter,
  Button,
  Dropdown,
  Input,
  TextInput,
  ActiveTripList,
  TripContent,
  Icon,
  Nvds,
  Images,
  Image,
  IconButton,
  DatePickerWrapper,
  Meta,
  MetaText,
  MetaIconView,
  MetaButton,
  Actions,
  Flex0,
  Flex1,
  Text,
  MoreButton,
  Label,
  NoTrips,
  CloseButton,
  Modal,
} from './styles'

class Lobby extends Component {
  constructor(props) {
    super(props)
    const { companies, producers, onGetCompanies, onGetProducers } = props

    this.state = {
      hideAnimation: new Animated.Value(1),
      selectedProducer: null,
      nvds: [],
      nvdIndex: -1,
      comments: '',
      rejectType: -1,
      currentTripId: null,
      isNvdVisible: false,
      driverLocation: null,
      morePage: 1,
      filterDate: new Date(),
      destinationType: [{ value: 'Feedlot', label: 'Feedlot', extendedLabel: 'Feedlot' }],
    }

    this.loader = null
    this.commentModal = null

    if (companies.length === 0) onGetCompanies()
    if (producers.length === 0) onGetProducers()
  }

  async componentDidMount() {
    const { user, freights, trips, onGetFreights, onGetTrips } = this.props

    try {
      this.loader.show()
      if (user.type === UserTypes.Producer && freights.length === 0) {
        await Promisify(onGetFreights)
      }
      if (trips.length === 0) {
        await Promisify(onGetTrips)
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

    if (user.type !== UserTypes.Driver) return

    try {
      const permissionGranted = await requestLocationPermission()

      if (permissionGranted) {
        navigator.geolocation.getCurrentPosition(this.getMyLocation, noop)
        this.locationWatchId = navigator.geolocation.watchPosition(this.getMyLocation, noop)
      } else {
        Alert.alert(
          'Direct Livestock',
          'Location permission is required to calculate the distance between you and the Property.',
          [
            {
              text: 'OK',
              style: 'cancel',
              onPress: BackHandler.exitApp,
            },
          ],
        )
      }
    } catch (e) {
      console.log(e)
    }
  }

  componentWillUnmount() {
    if (this.locationWatchId) {
      navigator.geolocation.clearWatch(this.locationWatchId)
      navigator.geolocation.stopObserving()
    }
  }

  getMyLocation = ({ coords }) => {
    console.log('Location changed', coords)
    this.setState({ driverLocation: coords })
  }

  setCommentModal = ref => {
    this.commentModal = ref
  }

  isTripCompletionAvailable = trip => {
    if (trip.status !== TripStatus.InProgress) return false
    const driverLocation = this.state.driverLocation || {
      longitude: Number(get(trip, 'driverLocation.coordinates[0]')),
      latitude: Number(get(trip, 'driverLocation.coordinates[1]')),
    }
    const distance = getDistanceFrom2LatLng(driverLocation, {
      longitude: Number(get(trip, 'destination.coordinates[0]')),
      latitude: Number(get(trip, 'destination.coordinates[1]')),
    })

    return distance < 10 * 1000 /* 10 kilometers */
  }

  getInitialValues = () => ({
    truckNumber: '',
    company: '',
    producer: '',
    property: '',
  })

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
    }

    return ValidationService.validate(constraints, values)
  }

  validateDriverLocation = driverLocation => {
    if (!driverLocation) {
      Alert.alert('Direct Livestock', 'Failed to get your location.', [
        {
          text: 'OK',
          style: 'cancel',
        },
      ])
      return false
    }

    return true
  }

  validateNvds = () => {
    const { nvds } = this.state
    if (nvds.length === 0) {
      Alert.alert(
        'Direct Livestock',
        'Please upload the photo of National Vendor Declaration (Cattle) And Bill documentations. You can upload up to 3 documents.',
        [
          {
            text: 'OK',
            style: 'cancel',
          },
        ],
      )
    }
    return nvds.length > 0
  }

  activeTripKeyExtractor = item => `#activeTrip${item.id}`

  getCompanyName = companyId => {
    const { companies } = this.props
    const company = companies.find(item => item.id === companyId)

    return get(company, 'name', '')
  }

  getDriverName = user => {
    const driver = user || this.props.user
    return `${get(driver, 'firstName')} ${get(driver, 'lastName')}`
  }

  getFreightName = driver => {
    const { freights } = this.props
    const freightId = get(driver, 'freightId')

    const freight = freights.find(item => item.id === freightId)
    return freight ? freight.name : ''
  }

  getProducerName = producerId => {
    const { producers } = this.props
    const producer = producers.find(item => item.id === producerId)

    return get(producer, 'businessName', '')
  }

  getProducerPhone = producerId => {
    const { producers } = this.props
    const producer = producers.find(item => item.id === producerId)

    return get(producer, 'phoneNumber', '')
  }

  getPropertyName = (producerId, propertyId) => {
    const { producers } = this.props
    if (producers.length === 0) return ''

    const { properties } = producers.find(item => item.id === producerId)
    const property = properties.find(item => item.id === propertyId)

    return get(property, 'name', '')
  }

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

  setLoader = ref => {
    this.loader = ref
  }

  handleEditTrip = tripId => () => {
    this.props.navigation.navigate({ routeName: tripRoute.edit, params: { tripId } })
  }

  handleViewDetail = tripId => async () => {
    this.props.navigation.navigate({
      routeName: tripRoute.detail,
      params: { tripId },
    })
  }

  handleCancelTrip = async tripId => {
    const { onUpdateTrip } = this.props
    const { comments } = this.state

    const payload = {
      id: tripId,
      status: TripStatus.Cancelled,
    }

    if (comments) {
      payload.comments = comments
    }

    try {
      this.commentModal.hide()
      this.loader.show()
      await Promisify(onUpdateTrip, payload)
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

  handleStartTrip = (tripId, status) => async () => {
    const { user } = this.props
    if (user.type === UserTypes.Driver && status === TripStatus.Approved) {
      // Mark as it in progress
      const { onUpdateTrip } = this.props
      const { driverLocation } = this.state
      if (!this.validateDriverLocation(driverLocation)) return
      const payload = {
        id: tripId,
        status: TripStatus.InProgress,
        driverLocation: [driverLocation.longitude, driverLocation.latitude],
      }

      try {
        this.loader.show()
        await Promisify(onUpdateTrip, payload)
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
    this.props.navigation.navigate({
      routeName: user.type === UserTypes.Driver ? tripRoute.map : tripRoute.view,
      params: { tripId },
    })
  }

  handleCommentChange = comments => {
    this.setState({ comments })
  }

  handleSubmitCommentModal = async () => {
    const { currentTripId, rejectType } = this.state
    if (rejectType === 0) {
      await this.handleRespondDriverRequest(currentTripId, false)()
    } else if (rejectType === 1) {
      await this.handleCancelTrip(currentTripId)
    }
  }

  handleCloseCommentModal = () => this.commentModal.hide()

  handleOpenRejectComment = tripId => () => {
    this.setState({ currentTripId: tripId, rejectType: 0 })
    this.commentModal.show()
  }

  handleOpenCancelComment = tripId => () => {
    this.setState({ currentTripId: tripId, rejectType: 1 })
    this.commentModal.show()
  }

  handleRespondDriverRequest = (tripId, isApprove) => async () => {
    const { onUpdateTrip } = this.props
    const { comments } = this.state
    const payload = {
      id: tripId,
      status: isApprove ? TripStatus.Approved : TripStatus.Rejected,
    }

    if (comments) {
      payload.comments = comments
    }

    try {
      this.commentModal.hide()
      this.loader.show()
      await Promisify(onUpdateTrip, payload)
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

  handleCompleteTrip = (tripId, tripName) => async () => {
    const { onUpdateTrip } = this.props
    const { driverLocation } = this.state
    const payload = {
      id: tripId,
      status: TripStatus.Completed,
    }

    try {
      this.loader.show()
      await Promisify(onUpdateTrip, payload)
      trackEvent(TripEvents.Name, TripEvents.Complete, {
        ...payload,
        name: tripName,
        driverLocation: driverLocation
          ? `${driverLocation.latitude}, ${driverLocation.longitude}`
          : null,
      })
      Alert.alert('Direct Livestock', 'The trip has been completed', [
        {
          text: 'OK',
          style: 'cancel',
          onPress: this.loader.hide,
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

  handleSubmit = async ({ truckNumber, cattleCapacity, company, producer, property }) => {
    const { onCreateTrip } = this.props
    // const { driverLocation } = this.state
    // if (!this.validateDriverLocation(driverLocation)) return
    if (!this.validateNvds()) return

    this.loader.show()
    try {
      const { streetNumber, streetName, suburbName, state, postCode, country } = company[0]
      const address = `${streetNumber} ${streetName}, ${suburbName} ${state} ${postCode}, ${country}`
      const { nvds } = this.state

      const payload = {
        name: `${producer[0].label}(${property[0].label}) - ${company[0].label}`,
        truckNumber,
        cattleCapacity: Number(cattleCapacity),
        producerId: producer[0].id,
        propertyId: property[0].id,
        companyId: company[0].id,
        origin: [
          get(property, '[0].position.coordinates[0]'),
          get(property, '[0].position.coordinates[1]'),
        ],
        destination: await getLngLatFromAddress(address),
//        driverLocation: [driverLocation.longitude, driverLocation.latitude],
        files: nvds,
      }

      await Promisify(onCreateTrip, payload)
      trackEvent(TripEvents.Name, TripEvents.Create, {
        ...payload,
        producer: producer[0].label,
        property: property[0].label,
        company: company[0].label,
        status: TripStatus.Waiting,
        origin: `${payload.origin[1]}, ${payload.origin[0]}`,
        destination: `${payload.destination[1]}, ${payload.destination[0]}`,
      //  driverLocation: `${payload.driverLocation[1]}, ${payload.driverLocation[0]}`,
      })
      this.handleCompleteSetup()
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

  handleCompleteSetup = () => {
    const { hideAnimation } = this.state
    this.props.onOpenTripForm()
    this.setState({ nvds: [] })
    Animated.timing(hideAnimation, {
      toValue: 1,
      duration: 250,
      easing: Easing.in(Easing.ease),
    }).start(() => {
      this.loader.hide()
    })
  }

  handleChangeProducer = value => this.setState({ selectedProducer: value[0] })

  handleAddNvds = () => {
    const { nvds } = this.state
    launchPicker({}, response => {
      this.setState({ nvds: nvds.concat([response]) })
    })
  }

  handleViewNvd = (idx, nvds) => () => {
    if (nvds && nvds.length > 0) {
      this.setState({ nvds })
    }

    this.setState({ nvdIndex: idx, isNvdVisible: true })
  }

  handleCloseNvd = () => {
    this.setState({ isNvdVisible: false })
  }

  handleRemoveNvd = id => () => {
    const { nvds } = this.state
    this.setState({ nvds: nvds.filter(nvd => nvd.id !== id) })
  }

  renderActiveTrip = ({ item }) => {
    const { user } = this.props
    const {
      id,
      name,
      truckNumber,
      cattleCapacity,
      producerId,
      propertyId,
      companyId,
      status,
      nvds,
    } = item

    const titleFrom = (
      <MetaText>
        <Text fontSize={1} lineHeight={1} fontWeight={800}>
          From{' '}
        </Text>
        <Text fontWeight={400} color="dustyGray">
          {this.getPropertyName(producerId, propertyId)}
        </Text>
      </MetaText>
    )
    const titleTo = (
      <MetaText>
        <Text fontSize={1} lineHeight={1} fontWeight={800}>
          To{' '}
        </Text>
        <Text fontWeight={400} color="dustyGray">
          {this.getCompanyName(companyId)}
        </Text>
      </MetaText>
    )

    const checkIf = (userType, ...statuses) => user.type === userType && statuses.includes(status)

    const startViewButtonEl = (checkIf(
      UserTypes.Driver,
      TripStatus.Approved,
      TripStatus.InProgress,
    ) ||
      checkIf(UserTypes.Producer, TripStatus.Approved, TripStatus.InProgress)) && (
      <Button
        title={
          user.type === UserTypes.Driver && status === TripStatus.Approved
            ? 'Start Trip'
            : 'View Trip'
        }
        onPress={this.handleStartTrip(id, status)}
        isLast
      />
    )

    const acceptButtonEl = checkIf(UserTypes.Producer, TripStatus.Waiting) && (
      <Button title="Accept" onPress={this.handleRespondDriverRequest(id, true)} isLast />
    )

    const declineButtonEl = checkIf(UserTypes.Producer, TripStatus.Waiting) && (
      <Button
        title="Decline"
        onPress={this.handleOpenRejectComment(id)}
        variant="secondary"
        isLast
      />
    )

    const editButtonEl = checkIf(UserTypes.Driver, TripStatus.Waiting) && (
      <Button title="Edit Trip" onPress={this.handleEditTrip(id)} isLast />
    )

    const cancelButtonEl = (checkIf(UserTypes.Driver, TripStatus.Waiting) ||
      checkIf(UserTypes.Producer, TripStatus.Approved, TripStatus.InProgress)) && (
      <Button
        title="Cancel Trip"
        onPress={this.handleOpenCancelComment(id)}
        variant="secondary"
        isLast
      />
    )

    const completeButtonEl = checkIf(UserTypes.Driver, TripStatus.InProgress) &&
      this.isTripCompletionAvailable(item) && (
        <Button title="Complete" onPress={this.handleCompleteTrip(id, name)} isLast />
      )

    const detailsButtonEl = (checkIf(
      UserTypes.Driver,
      TripStatus.Completed,
      TripStatus.Cancelled,
      TripStatus.Aborted,
      TripStatus.Rejected,
    ) ||
      checkIf(
        UserTypes.Producer,
        TripStatus.Completed,
        TripStatus.Cancelled,
        TripStatus.Aborted,
        TripStatus.Rejected,
      )) && <Button title="View Details" onPress={this.handleViewDetail(id, status)} isLast />

    const nvdsEl = nvds.length > 0 && (
      <MetaButton onPress={this.handleViewNvd(0, nvds)}>
        <MetaIconView isLast>
          <Icon glyph={attachmentIcon} />
        </MetaIconView>
        <Text fontSize={1} lineHeight={1} color="lightBlue" mb={4}>
          View NVDs
        </Text>
      </MetaButton>
    )

    if (user.type === UserTypes.Processor) {
      return (
        <TripContent height={100}>
          <Actions width="100%">
            <Flex1 mt={-3}>
              <Meta mb={4}>
                <Flex1>
                  <Text fontSize={1} lineHeight={1} numberOfLines={1}>
                    {this.getProducerName(producerId)}
                  </Text>
                </Flex1>
                <Icon glyph={dotIcon} tintColor={this.getStatusColor(status)} />
              </Meta>
              <Meta>
                <Text fontSize={1} lineHeight={1}>
                  {cattleCapacity}
                </Text>
                <Text fontSize={1} lineHeight={1} fontWeight={800}>
                  {' '}
                  Head
                </Text>
              </Meta>
            </Flex1>

            <Flex0 ml={4} mt={-3}>
              <Meta mb={4}>
                <Text fontSize={1} lineHeight={1} fontWeight={800}>
                  NVD{' '}
                </Text>
                <IconButton
                  onPress={this.handleViewNvd(0, nvds)}
                  iconGlyph={eye2Icon}
                  iconTintColor="lightBlue"
                  iconSize={20}
                />
              </Meta>
              <Meta>
                <Text fontSize={1} lineHeight={1} fontWeight={800}>
                  View Trip{' '}
                </Text>
                <IconButton
                  onPress={this.handleStartTrip(id)}
                  iconGlyph={eye2Icon}
                  iconTintColor="lightBlue"
                  iconSize={20}
                />
              </Meta>
            </Flex0>
          </Actions>
        </TripContent>
      )
    }

    return (
      <TripContent status={status}>
        <FormInner>
          <Text fontSize={1} lineHeight={1}>
            {this.getProducerName(producerId)}
          </Text>
          {titleFrom}
          {titleTo}

          <Meta mt={4}>
            <MetaIconView isFirst>
              <Icon glyph={cattleIcon} />
            </MetaIconView>
            <Text fontSize={1} lineHeight={1} color="dustyGray" mt={4}>
              {cattleCapacity} Heads
            </Text>
          </Meta>

          <Meta>
            <MetaIconView>
              <Icon glyph={userIcon} />
            </MetaIconView>
            <Text fontSize={1} lineHeight={1} color="dustyGray">
              {this.getProducerName(producerId)}
            </Text>
          </Meta>

          <Meta>
            <MetaIconView>
              <Icon glyph={phoneIcon} />
            </MetaIconView>
            <Text fontSize={1} lineHeight={1} color="dustyGray">
              {this.getProducerPhone(producerId)}
            </Text>
          </Meta>

          <Meta>
            <MetaIconView>
              <Icon glyph={truckIcon} />
            </MetaIconView>
            <Text fontSize={1} lineHeight={1} fontFamilyStyle="styles.semiBold" color="dustyGray">
              {truckNumber}
            </Text>
          </Meta>

          <Meta>
            <MetaIconView>
              <Icon glyph={statusIcon} />
            </MetaIconView>
            <Text fontSize={1} lineHeight={1} color={this.getStatusColor(status)}>
              {status}
            </Text>
          </Meta>

          {nvdsEl}
        </FormInner>

        <Actions>
          {startViewButtonEl}

          {acceptButtonEl}

          {declineButtonEl}

          {editButtonEl}

          {cancelButtonEl}

          {completeButtonEl}

          {detailsButtonEl}
        </Actions>
      </TripContent>
    )
  }

  renderForm = ({ handleSubmit }) => {
    const { selectedProducer, nvds, destinationType } = this.state
    const { producers } = this.props
    const companies = this.props.companies.filter(
      company => company.type === destinationType[0].value,
    )
    const properties = get(selectedProducer, 'properties', [])
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
            />

            <IconButton
              onPress={this.handleRemoveNvd(id)}
              iconGlyph={trashIcon}
              iconTintColor="white"
              iconSize={30}
            />
          </Images>
        </Meta>
      ))

    const destinationTypes = [
      { value: 'Feedlot', label: 'Feedlot', extendedLabel: 'Feedlot' },
      { value: 'Abattoir', label: 'Abattoir', extendedLabel: 'Abattoir' },
    ]

    return (
      <FormInner>
        <FormContent>
          <Label mt={-24}>Truck information</Label>

          <Field
            name="truckNumber"
            component={TextInput}
            keyboardType="default"
            placeholder={TripTooltips.number}
            autoCapitalize="characters"
          />

          <Field
            name="cattleCapacity"
            component={TextInput}
            keyboardType="numeric"
            placeholder={TripTooltips.cattle}
          />

          <Label>Source Location</Label>

          <Field
            name="producer"
            component={Dropdown}
            placeholder={TripTooltips.producer}
            onChange={this.handleChangeProducer}
            options={producers}
            editable
          />

          <Field
            name="property"
            component={Dropdown}
            placeholder={TripTooltips.property}
            options={properties}
            editable
          />

          <Label>Destination</Label>

          <Dropdown
            title="Select Destination Type"
            input={{
              value: destinationType,
              onChange: e => this.setState({ destinationType: e }),
            }}
            options={destinationTypes}
            placeholder="Select a Destination Type"
            editable
          />

          <Field
            name="company"
            component={Dropdown}
            placeholder={TripTooltips.company}
            options={companies}
            editable
          />

          <Label>National Vendor Declaration</Label>

          <Nvds>
            {addNvdsEl}

            {nvdsEl}
          </Nvds>
        </FormContent>

        <FormFooter>
          <Button title="Create a trip" onPress={handleSubmit} mx={-40} width="auto" />
          <Button
            title="Cancel"
            onPress={this.handleCompleteSetup}
            variant="tertiary"
            mx={-40}
            width="auto"
          />
        </FormFooter>
      </FormInner>
    )
  }

  render() {
    const { hideAnimation, nvds, nvdIndex, isNvdVisible, morePage, filterDate } = this.state
    const { user, isOpenedTripForm } = this.props

    const trips = this.props.trips
      .filter(
        f =>
          user.type !== UserTypes.Processor ||
          moment(f.createdAt).format('MM-DD-YYYY') === moment(filterDate).format('MM-DD-YYYY'),
      )
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, morePage * 10)

    const hideStyle = { opacity: hideAnimation }

    const formEl = isOpenedTripForm && (
      <Form
        initialValues={this.getInitialValues()}
        validate={this.validate}
        render={this.renderForm}
        onSubmit={this.handleSubmit}
      />
    )

    const filterCalendarEl = this.props.trips.length > 0 && user.type === UserTypes.Processor && (
      <DatePickerWrapper>
        <DatePicker
          style={{ width: '100%' }}
          date={filterDate}
          mode="date"
          placeholder="Select Date"
          maxDate={new Date()}
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          iconSource={calendarIcon}
          customStyles={{
            dateIcon: {
              position: 'absolute',
              right: 0,
              top: 11,
              width: 15,
              height: 17,
            },
            dateInput: {
              alignItems: 'flex-start',
              borderWidth: 0,
            },
          }}
          onDateChange={date => {
            this.setState({ filterDate: date })
          }}
        />
      </DatePickerWrapper>
    )

    const tripsListEl = trips.length > 0 && (
      <ActiveTripList
        key={trips.length}
        data={trips}
        keyExtractor={this.activeTripKeyExtractor}
        renderItem={this.renderActiveTrip}
      />
    )

    const noTripsEl = !trips.length && (
      <CenterContent>
        <NoTrips>
          <Text color="silver" fontFamilyStyle="styles.medium">
            There are no Trips.
          </Text>
        </NoTrips>
      </CenterContent>
    )

    const moreTripsButton = trips.length > 0 && morePage * 10 < this.props.trips.length && (
      <MoreButton onPress={() => this.setState({ morePage: morePage + 1 })}>More Trips</MoreButton>
    )
    const tripEl = !isOpenedTripForm && (
      <FormContent as={Animated.View} style={hideStyle}>
        {filterCalendarEl}

        {tripsListEl}

        {noTripsEl}

        {moreTripsButton}
      </FormContent>
    )

    const modalContent = (
      <Input placeholder="Comments" onChangeText={this.handleCommentChange} multiline />
    )

    const modalFooter = (
      <Meta>
        <Button title="Submit" onPress={this.handleSubmitCommentModal} mx={3} isLast width={120} />

        <Button
          variant="secondary"
          title="Cancel"
          onPress={this.handleCloseCommentModal}
          mx={3}
          isLast
          width={120}
        />
      </Meta>
    )

    return (
      <Container>
        <Scrollable>
          {formEl}
          {tripEl}

          <ImageView
            images={nvds}
            imageIndex={nvdIndex}
            isVisible={isNvdVisible}
            onClose={this.handleCloseNvd}
            controls={{
              close: CloseButton,
            }}
          />

          <Modal
            ref={this.setCommentModal}
            title="Please input comment"
            contentComponent={modalContent}
            footerComponent={modalFooter}
          />

          <Loader ref={this.setLoader} />
        </Scrollable>
      </Container>
    )
  }
}

Lobby.propTypes = {
  ...ReactNavigationPropTypes,
  companies: PT.array.isRequired,
  freights: PT.array.isRequired,
  producers: PT.array.isRequired,
  trips: PT.array.isRequired,
  user: PT.object.isRequired,
  onCreateTrip: PT.func.isRequired,
  onGetCompanies: PT.func.isRequired,
  onGetFreights: PT.func.isRequired,
  onGetProducers: PT.func.isRequired,
  onGetTrips: PT.func.isRequired,
  onUpdateTrip: PT.func.isRequired,
}

export default Lobby
