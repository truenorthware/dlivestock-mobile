import React, { Component } from 'react'
import { ViewPropTypes } from 'react-native'
import PT from 'prop-types'

import { Container, Icon, Label } from './styles'

class RadioButton extends Component {
  handlePress = () => {
    const { isChecked, value, onChange } = this.props

    if (!isChecked) {
      onChange(value)
    }
  }

  render() {
    const { variant, label, isChecked, isDisabled, isVertical, style } = this.props

    const labelEl = label && <Label isVertical={isVertical}>{label}</Label>

    return (
      <Container disabled={isDisabled} style={style} onPress={this.handlePress}>
        <Icon variant={variant} isDisabled={isDisabled} isChecked={isChecked} />

        {labelEl}
      </Container>
    )
  }
}

RadioButton.propTypes = {
  isChecked: PT.bool,
  isDisabled: PT.bool,
  isVertical: PT.bool,
  label: PT.string,
  style: ViewPropTypes.style,
  value: PT.string,
  variant: PT.string,
  onChange: PT.func.isRequired,
}

RadioButton.defaultProps = {
  isChecked: false,
  isDisabled: false,
  isVertical: true,
  label: null,
  style: {},
  value: null,
  variant: 'primary',
}

export { RadioButton }
