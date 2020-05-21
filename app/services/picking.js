import { Platform } from 'react-native'

import find from 'lodash/find'
import isNil from 'lodash/isNil'
import negate from 'lodash/negate'

const platformOS = () => Platform.OS

const lazify = fn => (...args) => {
  const action = fn(...args)
  return action && action()
}

const platform = (options, fallback = null) =>
  find([options[platformOS()], options.default, fallback], negate(isNil))

const platformLazy = lazify(platform)

export default {
  platform,
  platformLazy,
  platformOS,
}
