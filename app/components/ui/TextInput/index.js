import React, { Component } from 'react'
import { TextInput as TextInputRN, ViewPropTypes } from 'react-native'
import PT from 'prop-types'

import keys from 'lodash/keys'
import pick from 'lodash/pick'

import { FinalFormPropTypes } from 'constants/propTypes'

import { Container, Input, FieldLabel, FieldError } from './styles'

const TextInputPropTypesKeys = keys(TextInputRN.propTypes)

class TextInput extends Component {
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

  render() {
    const { input, meta, disabled, label, labelIcon, style, ...restProps } = this.props
    const { onChange, ...restInput } = input
    const { isFocused } = this.state

    const hasError = FieldError.hasError(meta)

    const textInputProps = pick(restProps, TextInputPropTypesKeys)
    const styleProps = pick(restProps, 'color')

    return (
      <Container style={style}>
        <FieldLabel icon={labelIcon} label={label} />

        <Input
          {...textInputProps}
          {...styleProps}
          {...restInput}
          isFocused={isFocused}
          hasError={hasError}
          onChangeText={onChange}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
          editable={!disabled}
        />

        <FieldError meta={meta} />
      </Container>
    )
  }
}

TextInput.propTypes = {
  ...FinalFormPropTypes,
  icon: PT.node,
  label: PT.string,
  labelIcon: PT.node,
  meta: PT.object,
  style: ViewPropTypes.style,
}

TextInput.defaultProps = {
  icon: null,
  label: null,
  meta: {
    touched: false,
  },
  labelIcon: null,
  style: {},
}

export { TextInput }
