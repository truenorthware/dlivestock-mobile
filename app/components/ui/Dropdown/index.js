import React, { Component } from 'react'
import { ViewPropTypes } from 'react-native'
import PT from 'prop-types'

import get from 'lodash/get'
import find from 'lodash/find'

import { FinalFormPropTypes } from 'constants/propTypes'

import {
  Container,
  FieldLabel,
  FieldError,
  Picker,
  PickerContent,
  PickerArrow,
  PickerArrowIcon,
  PickerValue,
  PickerValueMissing,
  Sheet,
} from './styles'

class Dropdown extends Component {
  getSelectedOptions = () => {
    const { input, options } = this.props

    if (!input.value || options.length === 0) {
      return []
    }

    return input.value.map(value => find(options, { value: get(value, 'value', '') }))
  }

  getValueFromSelectedOptions = options => {
    const values = options.map(option => get(option, 'label', ''))
    return values.join(', ')
  }

  handlePickerPress = () => {
    const { editable } = this.props
    if (!editable) return

    this.sheetRef.show()
  }

  handleSheetRef = ref => {
    this.sheetRef = ref
  }

  handleChange = value => {
    const { input, onChange } = this.props

    input.onChange(value)

    if (onChange) {
      onChange(value)
    }
  }

  renderPickerValue() {
    const { input, placeholder } = this.props

    if (!input.value && !placeholder) {
      return <PickerValueMissing />
    }

    const selectedOptions = this.getSelectedOptions()
    const isPlaceholder = !selectedOptions || selectedOptions.length === 0
    const value =
      selectedOptions && selectedOptions.length > 0
        ? this.getValueFromSelectedOptions(selectedOptions)
        : placeholder

    return <PickerValue isPlaceholder={isPlaceholder}>{value}</PickerValue>
  }

  renderPicker() {
    const { meta, isDisabled, style } = this.props

    const hasError = FieldError.hasError(meta)

    return (
      <Picker disabled={isDisabled} onPress={this.handlePickerPress}>
        <PickerContent disabled={isDisabled} hasError={hasError} style={style}>
          {this.renderPickerValue()}

          <PickerArrow>
            <PickerArrowIcon hasError={hasError} />
          </PickerArrow>
        </PickerContent>
      </Picker>
    )
  }

  render() {
    const { meta, input, label, title, style, options, ...sheetProps } = this.props

    return (
      <Container>
        <FieldLabel label={label} />

        {this.renderPicker()}

        <Sheet
          {...sheetProps}
          {...input}
          ref={this.handleSheetRef}
          title={title || label}
          options={options}
          selectedOptions={this.getSelectedOptions()}
          onChange={this.handleChange}
        />

        <FieldError meta={meta} />
      </Container>
    )
  }
}

Dropdown.propTypes = {
  ...FinalFormPropTypes,
  isDisabled: PT.bool,
  label: PT.string,
  meta: PT.object,
  options: PT.array,
  style: ViewPropTypes.style,
}

Dropdown.defaultProps = {
  isDisabled: false,
  label: null,
  meta: {
    touched: false,
  },
  options: [],
  style: {},
}

export { Dropdown }
