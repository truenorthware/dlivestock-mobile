export default apiCall => ({
  getTrips: () =>
    apiCall({
      endpoint: '/trips',
      method: 'GET',
      needsNormalization: false,
    }),

  getTrip: tripId =>
    apiCall({
      endpoint: `/trip/${tripId}`,
      method: 'GET',
      needsNormalization: false,
    }),

  createTrip: query =>
    apiCall({
      endpoint: '/trip',
      method: 'POST',
      query,
      needsNormalization: false,
    }),

  updateTrip: query =>
    apiCall({
      endpoint: `/trip/${query.id}`,
      method: 'PUT',
      query,
      needsNormalization: false,
    }),
})
