import React, { Component } from 'react'
import { Image as ImageRN } from 'react-native'
import PT from 'prop-types'

import get from 'lodash/get'
import keys from 'lodash/keys'

import { Container } from './styles'

const CONTENT_TYPES = {
  s: 'smallThumb',
  m: 'thumb',
  l: 'medium',
}

class Image extends Component {
  getUrl() {
    const { contentType, image } = this.props
    const type = get(CONTENT_TYPES, contentType)

    return get(image, `content.${type}.url`) || get(image, 'content.url')
  }

  getSource = () => this.props.source || { uri: this.getUrl() }

  render() {
    const { innerRef, contentType, source, ...restProps } = this.props

    return <Container source={this.getSource()} ref={innerRef} {...restProps} />
  }
}

Image.propTypes = {
  contentType: PT.oneOf(keys(CONTENT_TYPES)),
  image: PT.string,
  innerRef: PT.oneOfType([PT.string, PT.func]),
  resizeMode: PT.string,
  source: ImageRN.propTypes.source,
  tintColor: PT.string,
}

Image.defaultProps = {
  contentType: null,
  image: null,
  innerRef: null,
  resizeMode: 'contain',
  source: null,
  tintColor: null,
}

export { Image }
