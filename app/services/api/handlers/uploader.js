export default apiCall => ({
  uploadImage: ({ image, body }) =>
    apiCall({
      body,
      endpoint: '/images',
      method: 'POST',
      file: image,
    }),
})
