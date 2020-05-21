import { verification } from 'constants/routeNames'

import Screen from 'screens/Verification/Business'

export default {
  [verification.business]: {
    screen: Screen,

    navigationOptions: () => ({
      title: 'Business Information',
    }),
  },
}
