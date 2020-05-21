import { css } from 'styled-components/native'

import { getColor } from '../../rules'

export default {
  text: {
    default: css`
      color: ${getColor('deepBlue')};
    `,
    secondary: css`
      color: ${getColor('white')};
    `,
  },

  text__isPressed: {
    default: css`
      text-decoration-color: ${getColor('danube')};
    `,
    secondary: css`
      text-decoration-color: ${getColor('lightBlue')};
    `,
  },
}
