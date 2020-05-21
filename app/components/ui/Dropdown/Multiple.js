import React, { Component } from 'react'
import { ViewPropTypes } from 'react-native'
import PT from 'prop-types'

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

class DropdownMultiple extends Component {
  getSelectedOptions = () => {
    const { input, options } = this.props

    if (!input.value) {
      return []
    }

    return input.value.map(value => find(options, { value: value.value }))
  }

  getValueFromSelectedOptions = options => {
    const values = options.map(option => option.label)
    return values.join(', ')
  }

  handlePickerPress = () => {
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
    const { meta, isDisabled } = this.props

    const hasError = FieldError.hasError(meta)

    return (
      <Picker disabled={isDisabled} onPress={this.handlePickerPress}>
        <PickerContent hasError={hasError}>
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
      <Container style={style}>
        <FieldLabel label={label} />

        {this.renderPicker()}

        <Sheet
          {...sheetProps}
          {...input}
          ref={this.handleSheetRef}
          title={title || label}
          options={options}
          selectedOptions={this.getSelectedOptions()}
          multiple
          onChange={this.handleChange}
        />

        <FieldError meta={meta} />
      </Container>
    )
  }
}

DropdownMultiple.propTypes = {
  ...FinalFormPropTypes,
  isDisabled: PT.bool,
  label: PT.string,
  options: PT.array,
  style: ViewPropTypes.style,
}

DropdownMultiple.defaultProps = {
  isDisabled: false,
  label: null,
  options: [],
  style: {},
}

export { DropdownMultiple }
