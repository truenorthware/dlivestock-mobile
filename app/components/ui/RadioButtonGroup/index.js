import React, { Component } from 'react'
import { ViewPropTypes } from 'react-native'
import PT from 'prop-types'

import map from 'lodash/map'

import { FinalFormPropTypes } from 'constants/propTypes'

import { Container, ButtonList, RadioButton, FieldLabel, FieldError } from './styles'

class RadioButtonGroup extends Component {
  handleButtonChange = value => {
    const { input } = this.props
    input.onChange(value)
  }

  renderButton = (item, index) => {
    const { input, variant, gap, isDisabled, isVertical } = this.props

    const isChecked = input.value === item.value
    const isFirst = index === 0

    return (
      <RadioButton
        {...item}
        key={index}
        gap={gap}
        variant={variant}
        isFirst={isFirst}
        isChecked={isChecked}
        isDisabled={isDisabled}
        isVertical={isVertical}
        onChange={this.handleButtonChange}
      />
    )
  }

  render() {
    const { meta, label, options, isVertical, style } = this.props

    return (
      <Container style={style}>
        <FieldLabel label={label} />

        <ButtonList isVertical={isVertical}>{map(options, this.renderButton)}</ButtonList>

        <FieldError meta={meta} />
      </Container>
    )
  }
}

RadioButtonGroup.propTypes = {
  ...FinalFormPropTypes,
  gap: PT.number,
  isDisabled: PT.bool,
  isVertical: PT.bool,
  label: PT.string,
  style: ViewPropTypes.style,
  variant: PT.string,
}

RadioButtonGroup.defaultProps = {
  gap: 4,
  isDisabled: false,
  isVertical: true,
  label: null,
  style: {},
  variant: 'primary',
}

export { RadioButtonGroup }
