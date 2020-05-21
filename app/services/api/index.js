/* eslint no-unexpected-multiline: 0 */

import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import merge from 'lodash/merge'
import normalize from 'json-api-normalizer'
import superagent from 'superagent'
import qs from 'qs'

import servicesConfig from 'config/services'

import { getJWTHeader } from 'store/selectors/session'

import createHandlers from './handlers'

const DEFAULT_OPTIONS = {
  base: {
    url: servicesConfig.api.webUrl,
    endpoint: '',
    needsNormalization: true,
  },
  json: {
    method: 'GET',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    query: {},
  },
  upload: {
    method: 'POST',
    headers: { 'Content-Type': 'multipart/form-data' },
    query: {},
    body: {},
  },
}

const sendMethod = HTTPMethod =>
  HTTPMethod === 'post' || HTTPMethod === 'put' || HTTPMethod === 'patch' ? 'send' : 'query'

const sendArguments = (HTTPMethod, query) =>
  HTTPMethod === 'post' || HTTPMethod === 'put' || HTTPMethod === 'patch'
    ? JSON.stringify(query)
    : qs.stringify(query, { arrayFormat: 'brackets' })

const buildSuccessResponse = (body, dirtyOptions) => {
  const options = merge({}, DEFAULT_OPTIONS.base, dirtyOptions)
  const endpoint = options.endpoint || 'info'

  const data = options.needsNormalization ? normalize(body, { endpoint, camelizeKeys: true }) : body

  const meta = options.needsNormalization ? get(data, `meta.${endpoint}`) : {}

  return {
    data,
    meta,
    options,
    ok: true,
  }
}

const buildFailureResponse = (status, error, options = {}) => {
  return {
    data: error.response ? error.response.body : { message: error.message },
    options,
    ok: false,
  }
}

const getRequester = options => {
  const HTTPMethod = options.method.toLowerCase()
  const url = options.url + options.endpoint

  const request = superagent[HTTPMethod](url)

  if (options.file) {
    const { fieldName, ...file } = options.file

    request.attach(fieldName, file)
    request.query(options.query)

    if (!isEmpty(options.body)) {
      request.field(options.body)
    }
  } else {
    request[sendMethod(HTTPMethod)](sendArguments(HTTPMethod, options.query))
  }

  request.set(options.headers)

  return request
}

const create = store => {
  const request = (dirtyOptions, resolve) => {
    const options = merge({}, DEFAULT_OPTIONS.json, dirtyOptions)

    getRequester(options).end((error, data) => {
      if (isEmpty(data) || data.body === null) {
        merge(data, { body: {} })
      }

      if (error) {
        const status = get(data, 'error.status')
        const result = buildFailureResponse(status, error, options)
        resolve(result)
      } else {
        const result = buildSuccessResponse(data.body, options)
        resolve(result)
      }
    })
  }

  const apiCall = options =>
    new Promise(resolve => {
      const opts = merge({}, DEFAULT_OPTIONS.base, options)
      const JWTHeader = getJWTHeader(store.getState())
      // console.log('URL:', `${opts.url}${opts.endpoint}`)
      // console.log('JWT Header:', JWTHeader)
      // console.log('PARAMS:', opts.query)

      const baseOptions = merge(
        {},
        opts,
        opts.url === DEFAULT_OPTIONS.base.url &&
          JWTHeader && {
            headers: {
              Authorization: JWTHeader,
            },
          },
      )

      request(baseOptions, resolve)
    })

  // ------
  // STEP 2
  // ------
  //
  // Define some functions that call the api. The goal is to provide
  // a thin wrapper of the api layer providing nicer feeling functions
  // rather than "get", "post" and friends.
  //
  // I generally don't like wrapping the output at this level because
  // sometimes specific actions need to be take on `403` or `401`, etc.
  //
  // Since we can't hide from that, we embrace it by getting out of the
  // way at this level.
  //

  const handlers = createHandlers(apiCall)

  // ------
  // STEP 3
  // ------
  //
  // Return back a collection of functions that we would consider our
  // interface. Most of the time it'll be just the list of all the
  // methods in step 2.
  //
  // Notice we're not returning back the `api` created in step 1? That's
  // because it is scoped privately. This is one way to create truly
  // private scoped goodies in JavaScript.
  //
  return handlers
}

export default {
  create,
  buildSuccessResponse,
  buildFailureResponse,
}
