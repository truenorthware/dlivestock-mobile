import React, { Component } from 'react'
import { Animated, Keyboard } from 'react-native'

import { withTheme } from 'styled-components'

import { getMetrics } from 'theme'

import { TabBar } from './styles'

const ANIMATION_DURATION = 500

class MainTabBar extends Component {
  animation = new Animated.Value(0)

  componentWillMount() {
    this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow)

    this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide)
  }

  componentWillUnmount() {
    this.keyboardDidShowSub.remove()
    this.keyboardDidHideSub.remove()
  }

  handleKeyboardDidShow = () => {
    Animated.timing(this.animation, {
      toValue: 1,
      duration: ANIMATION_DURATION,
    }).start()
  }

  handleKeyboardDidHide = () => {
    Animated.timing(this.animation, {
      toValue: 0,
      duration: ANIMATION_DURATION,
    }).start()
  }

  render() {
    const height = getMetrics('mainTabBarHeight')(this.props)
    const marginBottomInterpolation = this.animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, height * -1],
    })

    return <TabBar {...this.props} style={{ marginBottom: marginBottomInterpolation }} />
  }
}

export const Main = withTheme(MainTabBar)
export { MainItem } from './Item'
