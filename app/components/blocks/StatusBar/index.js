import React from 'react'
import { StatusBar as StatusBarRN } from 'react-native'
import PT from 'prop-types'

const StatusBar = props => <StatusBarRN {...props} />

StatusBar.setHidden = StatusBarRN.setHidden

StatusBar.propTypes = {
  barStyle: PT.string,
  translucent: PT.bool,
}

StatusBar.defaultProps = {
  barStyle: 'dark-content',
  translucent: true,
}

export { StatusBar }
