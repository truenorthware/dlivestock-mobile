import { auth } from 'constants/routeNames'

import Screen from 'screens/Auth/SignUp'

import { RegisterEvents } from 'services/mixpanel'

export default {
  [auth.signUp]: {
    screen: Screen,

    navigationOptions: () => ({
      title: RegisterEvents.CreateAccount,
    }),
  },
}
