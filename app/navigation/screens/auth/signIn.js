import { auth } from 'constants/routeNames'

import Screen from 'screens/Auth/SignIn'

export default {
  [auth.signIn]: {
    screen: Screen,

    navigationOptions: () => ({
      header: null,
    }),
  },
}
