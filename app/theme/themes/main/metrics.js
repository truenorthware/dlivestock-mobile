import { Dimensions } from 'react-native'
import { getBottomSpace, getStatusBarHeight } from 'react-native-iphone-x-helper'

const { width, height } = Dimensions.get('window')

const STATUS_BAR_HEIGHT = getStatusBarHeight(true)
const STATUS_BAR_UNSAFE_HEIGHT = getStatusBarHeight()
const BOTTOM_SPACE = getBottomSpace()

export const SCREEN_WIDTH = width < height ? width : height
export const SCREEN_HEIGHT = width < height ? height : width

export default {
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,

  statusBarHeight: STATUS_BAR_HEIGHT,
  statusBarUnsafeHeight: STATUS_BAR_UNSAFE_HEIGHT,
  bottomSpace: BOTTOM_SPACE,

  mainTabBarHeight: 64,
  mainHeaderHeight: 64,
}
