import React, { Component } from 'react'
import { ViewPropTypes } from 'react-native'
import PT from 'prop-types'

import { FinalFormPropTypes } from 'constants/propTypes'

import { Container, IconContainer, Icon, Label } from './styles'

class Checkbox extends Component {
  handlePress = () => {
    const { input } = this.props
    input.onChange(!input.value)
  }

  render() {
    const { input, variant, label, isDisabled, style, labelProps } = this.props

    const isChecked = !!input.value

    const labelEl = label && <Label {...labelProps}>{label}</Label>

    const iconEl = isChecked && <Icon />

    return (
      <Container disabled={isDisabled} style={style} onPress={this.handlePress}>
        <IconContainer variant={variant} isDisabled={isDisabled} isChecked={isChecked}>
          {iconEl}
        </IconContainer>

        {labelEl}
      </Container>
    )
  }
}

Checkbox.propTypes = {
  ...FinalFormPropTypes,
  isDisabled: PT.bool,
  label: PT.string,
  labelProps: PT.object,
  style: ViewPropTypes.style,
  variant: PT.string,
}

Checkbox.defaultProps = {
  isDisabled: false,
  label: null,
  labelProps: {},
  style: {},
  variant: 'primary',
}

export { Checkbox }
