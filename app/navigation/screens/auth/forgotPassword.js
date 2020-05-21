import { auth } from 'constants/routeNames'

import Screen from 'screens/Auth/ForgotPassword'

export default {
  [auth.forgotPassword]: {
    screen: Screen,

    navigationOptions: () => ({
      title: 'Reset password',
    }),
  },
}
