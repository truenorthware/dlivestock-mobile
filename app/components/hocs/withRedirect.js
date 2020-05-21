import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import firebase from 'react-native-firebase'
import PT from 'prop-types'

import debounce from 'lodash/debounce'
import identity from 'lodash/identity'
import noop from 'lodash/noop'

import { CompaniesCreators } from 'store/actions/companies'
import { FreightsCreators } from 'store/actions/freights'
import { ProducersCreators } from 'store/actions/producers'
import { TripsCreators } from 'store/actions/trips'

import { trip as tripRoute, auth as AuthRoute } from 'constants/routeNames'
import { ReactNavigationPropTypes } from 'constants/propTypes'

const Nullable = () => null

const withRedirect = (composer = identity, redirector = noop) => (WrappedComponent = Nullable) => {
  const ACTIONS = {
    onGetCompanies: CompaniesCreators.getCompaniesRequest,
    onGetFreights: FreightsCreators.getFreightsRequest,
    onGetProducers: ProducersCreators.getProducersRequest,
    onGetTrips: TripsCreators.getTripsRequest,
  }

  class Redirect extends PureComponent {
    redirector = debounce(redirector, 100)

    componentWillMount() {
      this.redirector(this.props)
    }

    componentDidMount() {
      this.createNotificationListeners()
    }

    componentDidUpdate() {
      this.notificationOpenedListener()
      this.redirector(this.props)
    }

    createNotificationListeners() {
      /*
       * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
       * */
      this.notificationOpenedListener = firebase
        .notifications()
        .onNotificationOpened(notificationOpen => {
          this.props.onGetCompanies()
          this.props.onGetFreights()
          this.props.onGetProducers()
          this.props.onGetTrips()

          const { data } = notificationOpen.notification

          if (data.event === 'TRIP_CREATED' || data.event === 'TRIP_APPROVED') {
            if (this.props.isAuthenticated) {
              this.props.navigation.navigate({
                routeName: tripRoute.lobby,
              })
            } else {
              this.props.navigation.navigate({
                routeName: AuthRoute.signIn,
                params: {
                  referer: tripRoute.lobby,
                },
              })
            }
          }
        })
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }

  Redirect.propTypes = {
    ...ReactNavigationPropTypes,
    isAuthenticated: PT.bool.isRequired,
    onGetCompanies: PT.func.isRequired,
    onGetFreights: PT.func.isRequired,
    onGetProducers: PT.func.isRequired,
    onGetTrips: PT.func.isRequired,
  }

  const Wrapper = composer(
    connect(
      null,
      ACTIONS,
    )(Redirect),
  )

  Wrapper.router = WrappedComponent.router
  Wrapper.navigationOptions = WrappedComponent.navigationOptions
  return Wrapper
}

export { withRedirect }
