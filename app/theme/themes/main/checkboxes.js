import { css } from 'styled-components/native'

import { getColor } from '../../rules'

export default {
  iconContainer: {
    primary: css`
      border-color: ${getColor('pinkSalmon')};
    `,
    secondary: css`
      border-color: ${getColor('deepBlue')};
    `,
    tertiary: css`
      border-color: ${getColor('aquamarineBlue')};
    `,
  },

  iconContainer__isChecked: {
    primary: css`
      background-color: ${getColor('pinkSalmon')};
    `,
    secondary: css`
      background-color: ${getColor('deepBlue')};
    `,
    tertiary: css`
      background-color: ${getColor('aquamarineBlue')};
    `,
  },
}
