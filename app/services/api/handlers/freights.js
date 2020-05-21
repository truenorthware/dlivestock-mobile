export default apiCall => ({
  getFreights: () =>
    apiCall({
      endpoint: '/freights',
      method: 'GET',
      needsNormalization: false,
    }),
})
