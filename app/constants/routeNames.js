import { createNames } from 'utils/navigation'

export const navigators = createNames(['app', 'auth', 'menu', 'verification'], {
  prefix: 'navigators/',
})

export const app = createNames(['redirector', 'progress'], {
  prefix: 'app/',
})

export const auth = createNames(['signIn', 'signUp', 'forgotPassword', 'passwordChanged'], {
  prefix: 'auth/',
})

export const verification = createNames(['business', 'property'], {
  prefix: 'verification/',
})

export const menu = createNames(['trip', 'profile', 'tripDashboard'], {
  prefix: 'menu/',
})

export const profile = createNames(['userInfo', 'business', 'property'], {
  prefix: 'profile/',
})

export const trip = createNames(['lobby', 'edit', 'map', 'view', 'detail'], {
  prefix: 'trip/',
})

export const tripDashboard = createNames(['view'], {
  prefix: 'dashboard/',
})
