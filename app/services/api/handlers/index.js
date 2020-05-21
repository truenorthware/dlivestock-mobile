import auth from './auth'
import companies from './companies'
import freights from './freights'
import producers from './producers'
import trips from './trips'
import uploader from './uploader'

export default apiCall => ({
  auth: auth(apiCall),
  companies: companies(apiCall),
  freights: freights(apiCall),
  producers: producers(apiCall),
  trips: trips(apiCall),
  uploader: uploader(apiCall),
})
