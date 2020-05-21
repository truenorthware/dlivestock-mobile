/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { YellowBox } from 'react-native'

import createStore from 'store'
import { StatefulNavigation } from './navigation'

YellowBox.ignoreWarnings(['Require cycle:'])

class App extends Component {
  store = createStore()

  render() {
    return (
      <Provider store={this.store}>
        <StatefulNavigation />
      </Provider>
    )
  }
}

export default App
