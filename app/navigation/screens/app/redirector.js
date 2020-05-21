import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import { NavigationActions } from 'react-navigation'

import { app, navigators } from 'constants/routeNames'

import { isAuthenticated, user } from 'store/selectors/session'

import { UserTypes } from 'services/dataTypes'

import { withRedirect } from 'components/hocs'
import Screen from 'screens/Progress'

const SELECTOR = createStructuredSelector({
  isAuthenticated,
  user,
})

const COMPOSER = connect(SELECTOR)

const privateFlow = props => {
  return props.user.type === UserTypes.Producer && props.user.properties.length === 0
    ? props.navigation.dispatch(NavigationActions.navigate({ routeName: navigators.verification }))
    : props.navigation.dispatch(NavigationActions.navigate({ routeName: navigators.menu }))
}

const publicFlow = props =>
  props.navigation.dispatch(NavigationActions.navigate({ routeName: navigators.auth }))

const REDIRECTOR = props => (props.isAuthenticated ? privateFlow(props) : publicFlow(props))

export default {
  [app.redirector]: {
    screen: withRedirect(COMPOSER, REDIRECTOR)(Screen),
  },
}
