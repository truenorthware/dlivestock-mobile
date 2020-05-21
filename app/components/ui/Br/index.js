import PT from 'prop-types'
import React from 'react'

import times from 'lodash/times'

import { Text } from '../Text'

const Br = ({ size, ...restProps }) => <Text {...restProps}>{times(size, () => '\n')}</Text>

Br.propTypes = {
  size: PT.number,
}

Br.defaultProps = {
  size: 1,
}

export { Br }
