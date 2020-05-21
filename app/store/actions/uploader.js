import { createActions } from 'reduxsauce'

export const { Types: UploaderTypes, Creators: UploaderCreators } = createActions(
  {
    uploadImageRequest: ['image', 'body'],
    uploadImageSuccess: ['response'],
    uploadImageFailure: ['response'],
  },
  { prefix: 'Uploader/' },
)
