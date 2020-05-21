import { auth } from 'constants/routeNames'

import Screen from 'screens/Auth/PasswordChanged'

export default {
  [auth.passwordChanged]: {
    screen: Screen,

    navigationOptions: () => ({
      title: 'Password changed',
    }),
  },
}
