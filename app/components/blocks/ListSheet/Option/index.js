import React, { Component } from 'react'
import { ViewPropTypes } from 'react-native'
import PT from 'prop-types'

import { Touchable, Container, Label } from './styles'

class Option extends Component {
  handlePress = () => {
    const { option, isSelected, multiple, onChange } = this.props

    if (multiple) {
      onChange(option)
    } else if (!isSelected) {
      onChange(option)
    }
  }

  render() {
    const { option, isSelected, style } = this.props

    return (
      <Touchable onPress={this.handlePress}>
        <Container isSelected={isSelected} style={style}>
          <Label isSelected={isSelected}>{option.extendedLabel}</Label>
        </Container>
      </Touchable>
    )
  }
}

Option.propTypes = {
  isSelected: PT.bool.isRequired,
  multiple: PT.bool.isRequired,
  option: PT.object.isRequired,
  style: ViewPropTypes.style,
  onChange: PT.func.isRequired,
}

Option.defaultProps = {
  style: {},
}

export default Option
