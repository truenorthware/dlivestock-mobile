export default apiCall => ({
  getCompanies: () =>
    apiCall({
      endpoint: '/companies',
      method: 'GET',
      query: {
        requestType: 'driver',
      },
      needsNormalization: false,
    }),
})
