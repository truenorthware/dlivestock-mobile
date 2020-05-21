import { createActions } from 'reduxsauce'

export const { Types: ThemeTypes, Creators: ThemeCreators } = createActions(
  {
    switchTheme: ['theme'],
  },
  { prefix: 'Theme/' },
)
