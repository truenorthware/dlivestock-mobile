import React, { Component } from 'react'
import { ViewPropTypes, TextInput } from 'react-native'

import { TextInputMask } from 'react-native-masked-text'

import PT from 'prop-types'

import keys from 'lodash/keys'
import pick from 'lodash/pick'

import { FinalFormPropTypes } from 'constants/propTypes'

import { Container, Input, FieldLabel, FieldError } from './styles'

const TextInputMaskPropTypes = {
  ...TextInput.propTypes,
  type: PT.string.isRequired,
  options: PT.object.isRequired,
}

const TextInputMaskPropTypesKeys = keys(TextInputMaskPropTypes)

class MaskedTextInput extends Component {
  state = {
    isFocused: false,
  }

  handleFocus = () => {
    const { input } = this.props

    this.setState({ isFocused: true }, input.onFocus)
  }

  handleBlur = () => {
    const { input } = this.props

    this.setState({ isFocused: false }, input.onBlur)
  }

  handleTextChange = (maskedValue, rawValue) => {
    const { input } = this.props
    input.onChange(rawValue)
  }

  render() {
    const { input, meta, label, style, ...restProps } = this.props
    const { onChange, ...restInput } = input
    const { isFocused } = this.state

    const hasError = FieldError.hasError(meta)

    const textInputProps = pick(restProps, TextInputMaskPropTypesKeys)
    const styleProps = pick(restProps, 'color')

    return (
      <Container style={style}>
        <FieldLabel label={label} />

        <Input
          {...textInputProps}
          {...styleProps}
          {...restInput}
          as={TextInputMask}
          includeRawValueInChangeText
          isFocused={isFocused}
          hasError={hasError}
          onChangeText={this.handleTextChange}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
        />

        <FieldError meta={meta} />
      </Container>
    )
  }
}

MaskedTextInput.propTypes = {
  ...FinalFormPropTypes,
  label: PT.string,
  style: ViewPropTypes.style,
}

MaskedTextInput.defaultProps = {
  label: null,
  style: {},
}

export { MaskedTextInput }
