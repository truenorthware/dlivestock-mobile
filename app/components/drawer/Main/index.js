import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import { AuthCreators } from 'store/actions/auth'

import { userType, user } from 'store/selectors/session'

import Component from './Drawer'

const SELECTOR = createStructuredSelector({
  userType,
  user,
})

const ACTIONS = {
  handleLogOut: AuthCreators.logOutRequest,
}

const MainDrawer = connect(
  SELECTOR,
  ACTIONS,
)(Component)

export const Main = MainDrawer
