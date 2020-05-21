import Mixpanel from 'react-native-mixpanel'
import Secrets from 'react-native-config'

Mixpanel.sharedInstanceWithToken(Secrets.MIXPANEL_TOKEN)

export const AppScreens = {
  Register: 'Mobile Sign Up Screen',
  Login: 'Mobile Login Screen',
  EditProfile: 'Mobile Edit Profile',
  EditBusiness: 'Mobile Edit Business',
  EditProperty: 'Mobile Edit Property',
}

export const RegisterEvents = {
  Name: 'Sign Up',
  RequestSms: 'Request SMS',
  ResendSms: 'Resend SMS',
  VerifySmsSuccess: 'Succeed SMS Verification',
  CreateAccount: 'Create an Account',
}

export const ProfileEvents = {
  Name: 'Profile',
  AddBusinessInfo: 'Add Business Information',
  UpdateProducerProfile: 'Update Producer Profile',
  UpdateDriverProfile: 'Update Driver Profile',
}

export const AuthEvents = {
  Name: 'Authentication',
  SignIn: 'Logged in',
}

export const TripEvents = {
  Name: 'Trip',
  Create: 'Create Trip',
  Update: 'Update Trip',
  Complete: 'Complete Trip',
  UpdateDriverLocation: 'Driver Location',
}

export const setUser = userId => {
  Mixpanel.identify(userId.toString())
}

export const trackEvent = (eventName, actionName, payload) => {
  const finalPayload = JSON.parse(JSON.stringify(payload))
  Mixpanel.trackWithProperties(`${eventName}-${actionName}`, {
    ...finalPayload,
    Source: 'mobile',
  })
}
