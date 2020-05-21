export default apiCall => ({
  getProducers: () =>
    apiCall({
      endpoint: '/producers',
      method: 'GET',
      needsNormalization: false,
    }),
})
