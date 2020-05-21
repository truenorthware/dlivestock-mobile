import React, { Component } from 'react'

import Secrets from 'react-native-config'

import NavigationService from 'services/navigation'

import RootNavigator from 'navigation/navigators/root'

class NavigatorWrapper extends Component {
  /**
   * Initialize the NavigationService
   *
   * @see https://reactnavigation.org/docs/en/navigating-without-navigation-prop.html
   */
  handleNavigatorRef = ref => {
    NavigationService.setTopLevelNavigator(ref)
  }

  render() {
    return (
      <RootNavigator
        ref={this.handleNavigatorRef}
        uriPrefix={`${Secrets.HOST_PROTOCOL}://${Secrets.HOST_NAME}`}
      />
    )
  }
}

export default NavigatorWrapper
