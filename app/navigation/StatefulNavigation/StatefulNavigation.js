import React, { Component } from 'react'

import PT from 'prop-types'

import reduxPersistConfig from 'config/reduxPersist'

import { themes, ThemeProvider } from 'theme'

import ProgressScreen from 'screens/Progress'

import NavigatorWrapper from './NavigatorWrapper'

import { Container } from './styles'

class StatefulNavigation extends Component {
  async componentDidMount() {
    if (!reduxPersistConfig.active) {
      this.props.onStartup()
    }
  }

  get theme() {
    return themes[this.props.theme]
  }

  renderContent = () => {
    const { isRestored } = this.props

    if (!isRestored) {
      return <ProgressScreen />
    }

    return <NavigatorWrapper />
  }

  render() {
    return (
      <ThemeProvider theme={this.theme}>
        <Container>{this.renderContent()}</Container>
      </ThemeProvider>
    )
  }
}

StatefulNavigation.propTypes = {
  isRestored: PT.bool.isRequired,
  theme: PT.string.isRequired,
  onStartup: PT.func.isRequired,
}

export default StatefulNavigation
