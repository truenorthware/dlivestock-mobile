import assign from 'lodash/assign'
import castArray from 'lodash/castArray'
import curry from 'lodash/curry'
import flatten from 'lodash/flatten'
import get from 'lodash/get'
import join from 'lodash/join'
import map from 'lodash/map'
import reduce from 'lodash/reduce'
import uniq from 'lodash/uniq'

export const buildResource = ({ id, type, attributes, relationships }) =>
  assign(
    id && { id },
    type && { type },
    attributes && { attributes },
    relationships && { relationships },
  )

export const buildResources = ({ ids, ...restAttrs }) =>
  map(ids, id => buildResource({ id, ...restAttrs }))

export const buildInclude = list => join(uniq(list))

const attachLeafToStem = curry((stem, leaf) => (stem ? `${stem}.${leaf}` : leaf))

export const createIncluderBuilder = leaves => stems =>
  flatten(map(castArray(stems), stem => map(leaves, attachLeafToStem(stem))))

export const parseErrorResponse = response =>
  reduce(
    get(response, 'body.errors'),
    (acc, error) => [
      ...acc,
      {
        title: error.title,
        description: error.detail,
      },
    ],
    [],
  )

export const formatErrorResponseString = response => {
  const errors = parseErrorResponse(response)

  if (errors.length === 0) {
    return null
  }

  return reduce(
    errors,
    (acc, error, index) => {
      const text = `${error.title}\n${error.description}`

      if (errors.length === 1 || index === errors.length - 1) {
        return text
      }

      return `${text}\n\n`
    },
    '',
  )
}
