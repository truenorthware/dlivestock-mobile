import { css } from 'styled-components/native'

import { getColor } from '../../rules'

export default {
  icon__isChecked: {
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

  icon__isDisabled: {
    default: css`
      border-color: ${getColor('gallery')};
      background-color: ${getColor('gallery')};
    `,
  },

  icon__isDisabled__isChecked: {
    default: css`
      background-color: ${getColor('white')};
    `,
  },
}
