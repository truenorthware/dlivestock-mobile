import styled from 'styled-components/native'

import { BottomTabBar } from 'react-navigation'

import { getColor, getMetrics } from 'theme'

export const TabBar = styled(BottomTabBar).attrs(props => ({
  activeBackgroundColor: getColor('white')(props),
  inactiveBackgroundColor: getColor('white')(props),
  activeTintColor: getColor('pinkSalmon')(props),
  inactiveTintColor: getColor('mercury')(props),
  showLabel: false,
}))`
  height: ${getMetrics('mainTabBarHeight')};
  background-color: ${getColor('white')};
  border-top-width: 0;
`
