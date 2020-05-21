import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import { isRestored } from 'store/selectors/app'
import { getCurrentTheme } from 'store/selectors/theme'

import { AppCreators } from 'store/actions/app'

import Component from './StatefulNavigation'

const SELECTOR = createStructuredSelector({
  isRestored,
  theme: getCurrentTheme,
})

const ACTIONS = {
  onStartup: AppCreators.startup,
}

export default connect(
  SELECTOR,
  ACTIONS,
)(Component)
