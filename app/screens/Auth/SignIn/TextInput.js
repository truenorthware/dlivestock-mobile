import React, { Component } from 'react'
import { TextInput as TextInputRN } from 'react-native'
import PT from 'prop-types'

import keys from 'lodash/keys'
import pick from 'lodash/pick'

import { FinalFormPropTypes } from 'constants/propTypes'

import { FieldSet, Input, Icon } from './styles'

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

  hasError = meta =>
    meta.touched && (meta.error || (meta.submitError && !meta.dirtySinceLastSubmit))

  render() {
    const { input, icon, meta, disabled, ...restProps } = this.props
    const { onChange, ...restInput } = input
    const { isFocused } = this.state

    const hasError = this.hasError(meta)

    const textInputProps = pick(restProps, TextInputPropTypesKeys)
    const styleProps = pick(restProps, 'color')

    return (
      <FieldSet>
        <Icon glyph={icon} />

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
      </FieldSet>
    )
  }
}

TextInput.propTypes = {
  ...FinalFormPropTypes,
  icon: PT.node,
}

TextInput.defaultProps = {
  icon: null,
}

export default TextInput
