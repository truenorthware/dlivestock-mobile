import { verification } from 'constants/routeNames'

import Screen from 'screens/Verification/Property'

export default {
  [verification.property]: {
    screen: Screen,

    navigationOptions: () => ({
      title: 'Properties',
    }),
  },
}
