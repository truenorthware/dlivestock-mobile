import castArray from 'lodash/castArray'
import concat from 'lodash/concat'
import get from 'lodash/get'
import merge from 'lodash/merge'
import reduce from 'lodash/reduce'
import set from 'lodash/set'
import slice from 'lodash/slice'

import { NavigationActions } from 'react-navigation'

/**
 * Accepts routes hash and returns navigation-ready routes names using "options"
 * argument with prefix
 */

export const createNames = (routes, dirtyOptions) => {
  const DEFAULT_OPTIONS = { prefix: '' }
  const options = merge({}, DEFAULT_OPTIONS, dirtyOptions)

  return reduce(
    routes,
    (names, route) => set(names, route, options.prefix ? options.prefix + route : route),
    {},
  )
}

/**
 * Make a navigator replaceable by modifying its getStateForAction reducer.
 *
 * @see https://medium.com/handlebar-labs/replace-a-screen-using-react-navigation-a503eab207eb
 */

export const makeReplaceable = (navigator, screens, dirtyOptions) => {
  const DEFAULT_OPTIONS = {
    replaceWhen: (action, state) => {
      if (!state || action.type !== NavigationActions.NAVIGATE) {
        return false
      }

      const strategy = get(action, 'params.replacementStrategy')
      const replaceLast = strategy === 'last'
      const replaceEverything = strategy === 'everything'

      if (replaceLast || replaceEverything) {
        return {
          last: replaceLast,
          everything: replaceEverything,
        }
      }

      return false
    },
  }

  const replaceRoute = (routes, navAction, replacement) => {
    const route = {
      key: navAction.routeName,
      routeName: navAction.routeName,
      params: navAction.params || {},
    }

    return replacement.everything
      ? castArray(route)
      : concat(slice(routes, 0, routes.length - 1), route)
  }

  const options = merge({}, DEFAULT_OPTIONS, dirtyOptions)
  const prevGetStateForAction = navigator.router.getStateForAction

  set(navigator, 'router.getStateForAction', (action, state) => {
    const replacement = options.replaceWhen(action, state, screens)

    if (replacement) {
      const routes = replaceRoute(state.routes, action, replacement)
      return { ...state, routes, index: routes.length - 1 }
    }

    return prevGetStateForAction(action, state)
  })

  return navigator
}
