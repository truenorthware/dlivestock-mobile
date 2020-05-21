import { css } from 'styled-components/native'

import { getColor } from '../../rules'

export default {
  container: {
    primary: css`
      background-color: #0000;
    `,
    secondary: css`
      background-color: #0000;
    `,
    tertiary: css`
      background-color: ${getColor('white')};
    `,
    quarter: css`
      background-color: ${getColor('white')};
    `,
  },

  text: {
    primary: css`
      color: ${getColor('white')};
    `,
    secondary: css`
      color: ${getColor('white')};
    `,
    tertiary: css`
      color: ${getColor('black')};
    `,
    quarter: css`
      color: ${getColor('lightRed')};
    `,
  },

  container__isPressed: {
    primary: css`
      opacity: 0.8;
      border-width: 2px;
      border-color: #fff0;
    `,
    secondary: css`
      opacity: 0.8;
      border-width: 2px;
      border-color: #fff0;
    `,
    tertiary: css`
      opacity: 0.8;
      border-width: 2px;
      border-color: #fff0;
    `,
    quarter: css`
      opacity: 0.8;
      border-width: 2px;
      border-color: #fff0;
    `,
  },
}
