/**
 * The navigation is implemented as a service so that it can be used outside of
 * components, for example in sagas.
 *
 * @see https://reactnavigation.org/docs/en/navigating-without-navigation-prop.html
 */

let navigator

/**
 * This function is called when the RootContainer is created to set the
 * navigator instance to use.
 */
function setTopLevelNavigator(navigatorRef) {
  navigator = navigatorRef
}

/**
 * Call this function when you want to dispatch arbitrary action as you would
 * do this with 'navigation' prop.
 *
 * @param options All proxied options which navigator's dispatch may support.
 */

function dispatch(...options) {
  if (navigator) {
    navigator.dispatch(...options)
  }
}

const routeNameGetter = state =>
  state.index !== undefined ? routeNameGetter(state.routes[state.index]) : state.routeName

const getRouteName = () => (navigator ? routeNameGetter(navigator.state.nav) : null)

export default {
  setTopLevelNavigator,
  dispatch,
  getRouteName,
}
