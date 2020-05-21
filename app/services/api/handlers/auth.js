export default apiCall => ({
  resendSms: ({ email }) =>
    apiCall({
      endpoint: '/user/resend-sms',
      method: 'POST',
      query: {
        email,
      },
      needsNormalization: false,
    }),

  verifySms: ({ email, sms }) =>
    apiCall({
      endpoint: '/user/verify-sms',
      method: 'POST',
      query: {
        email,
        sms,
        source: 'mobile',
      },
      needsNormalization: false,
    }),

  addBusinessInfo: payload =>
    apiCall({
      endpoint: '/user/add-business',
      method: 'POST',
      query: payload,
      needsNormalization: false,
    }),

  updateProfile: payload =>
    apiCall({
      endpoint: '/user/update-profile',
      method: 'POST',
      query: payload,
      needsNormalization: false,
    }),

  signInToken: () =>
    apiCall({
      endpoint: '/user/auth',
      method: 'POST',
      query: {
        source: 'mobile',
      },
      needsNormalization: false,
    }),

  signIn: ({ email, password, fcmToken }) =>
    apiCall({
      endpoint: '/user/login',
      method: 'POST',
      query: {
        email,
        password,
        fcmToken,
        source: 'mobile',
      },
      needsNormalization: false,
    }),

  signUp: payload =>
    apiCall({
      endpoint: '/user/signup',
      method: 'POST',
      query: {
        ...payload,
        source: 'mobile',
      },
      needsNormalization: false,
    }),

  resetPassword: ({ email }) =>
    apiCall({
      endpoint: '/reset_password',
      method: 'POST',
      query: {
        email,
      },
      needsNormalization: false,
    }),
})
