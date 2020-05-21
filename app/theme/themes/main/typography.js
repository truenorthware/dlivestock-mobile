const GROUPS = {
  suDisplayBlack: 'SFUIDisplay',
}

const STYLES = {
  black: 'Black',
  bold: 'Bold',
  heavy: 'Heavy',
  light: 'Light',
  medium: 'Medium',
  regular: 'Regular',
  semiBold: 'Semibold',
  thin: 'Thin',
  ultralight: 'Ultralight',
}

export default {
  styles: STYLES,
  groups: GROUPS,

  variants: {
    primary: {
      group: GROUPS.suDisplayBlack,
      style: STYLES.regular,
    },

    secondary: {
      group: GROUPS.suDisplayBlack,
      style: STYLES.regular,
    },
  },
}
