import React, { Component } from 'react'
import { Animated, Easing, Keyboard, Modal } from 'react-native'
import PT from 'prop-types'

import { withTheme } from 'styled-components/native'

import { getSpace } from 'theme'

import findIndex from 'lodash/findIndex'
import remove from 'lodash/remove'
import map from 'lodash/map'
import merge from 'lodash/merge'
import reduce from 'lodash/reduce'
import union from 'lodash/union'

import PickingService from 'services/picking'

import { listWithSeparators } from 'utils/presentational'

import {
  Container,
  StatusBar,
  Overlay,
  OverlayBackground,
  Body,
  Header,
  HeaderTitle,
  Content,
  Separator,
  Option,
  getMaxHeight,
  getBottomSpace,
} from './styles'

class ListSheetComponent extends Component {
  constructor(props) {
    super(props)

    this.scrollEnabled = false
    this.translateY = this.calculateHeight(props)

    this.state = {
      isVisible: false,
      sheetAnimation: new Animated.Value(this.translateY),
      overlayAnimation: new Animated.Value(0),
      selectedOptions: [],
    }
  }

  componentDidMount() {
    PickingService.platformLazy({
      ios: () => {
        Keyboard.addListener('keyboardWillShow', this.onKeyboardWillShow)
        Keyboard.addListener('keyboardWillHide', this.onKeyboardWillHide)
      },
      android: () => {
        Keyboard.addListener('keyboardDidShow', this.onKeyboardWillShow)
        Keyboard.addListener('keyboardDidHide', this.onKeyboardWillHide)
      },
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.options.length !== nextProps.options.length) {
      this.translateY = this.calculateHeight(nextProps)

      Animated.timing(this.state.sheetAnimation, {
        toValue: this.translateY,
        duration: 100,
      }).start()
    }

    if (!this.props.selectedOptions.every(option => nextProps.selectedOptions.includes(option))) {
      this.setState({ selectedOptions: nextProps.selectedOptions })
    }
  }

  componentWillUnmount() {
    PickingService.platformLazy({
      ios: () => {
        Keyboard.removeListener('keyboardWillShow', this.onKeyboardWillShow)
        Keyboard.removeListener('keyboardWillHide', this.onKeyboardWillHide)
      },
      android: () => {
        Keyboard.removeListener('keyboardDidShow', this.onKeyboardWillShow)
        Keyboard.removeListener('keyboardDidHide', this.onKeyboardWillHide)
      },
    })
  }

  calculateHeight = props => {
    const getHeight = Comp =>
      reduce(
        ['height', 'm', 'mt', 'mb'],
        (acc, property) => {
          const value = merge({}, ...Comp.attrs)[property]
          const computedValue = property === 'height' ? value : getSpace(value)(props)

          return acc + (computedValue || 0)
        },
        0,
      )

    const header = getHeight(Header)
    const options = props.options.length * getHeight(Option)
    const separators = (props.options.length - 1) * getHeight(Separator)
    const extraBottomSpace = getBottomSpace(props, true)
    const maxHeight = getMaxHeight(props)

    let height = header + options + separators + extraBottomSpace

    if (height > maxHeight) {
      this.scrollEnabled = true
      height = maxHeight
    } else {
      this.scrollEnabled = false
    }

    return height
  }

  handleCancel = () => {
    this.hide()
  }

  show = () => {
    this.setState({ isVisible: true }, () => {
      this.showSheet()
    })
  }

  hide = value => {
    if (value) {
      this.props.onChange(value)
    }

    this.hideSheet(() => this.setState({ isVisible: false }))
  }

  showSheet = () => {
    const { sheetAnimation, overlayAnimation } = this.state

    Animated.parallel([
      Animated.timing(sheetAnimation, {
        toValue: 0,
        duration: 250,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(overlayAnimation, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.ease),
      }),
    ]).start()
  }

  hideSheet = callback => {
    const { sheetAnimation, overlayAnimation } = this.state

    Animated.parallel([
      Animated.timing(sheetAnimation, {
        toValue: this.translateY,
        duration: 200,
      }),
      Animated.timing(overlayAnimation, {
        toValue: 0,
        duration: 400,
      }),
    ]).start(callback)
  }

  handleOptionChange = value => {
    if (this.props.multiple) {
      const { selectedOptions } = this.state
      const isSelected = findIndex(selectedOptions, { value: value.value }) >= 0

      let values = []

      if (isSelected) {
        remove(selectedOptions, option => option.value === value.value)
        values = selectedOptions

        this.setState({ selectedOptions })
      } else {
        values = union(selectedOptions || [], [value])

        this.setState({ selectedOptions: values })
      }

      this.props.onChange(values)
    } else {
      this.hide([value])

      this.props.onChange([value])
    }
  }

  renderOption = (option, index) => {
    const { selectedOptions } = this.state

    const isSelected = findIndex(selectedOptions, { value: option.value }) >= 0

    return (
      <Option
        key={option.value || index}
        option={option}
        isSelected={isSelected}
        multiple={this.props.multiple}
        onChange={this.handleOptionChange}
      />
    )
  }

  renderSeparator = ({ index }) => <Separator key={`separator-${index}`} />

  render() {
    const { title, options } = this.props
    const { isVisible, sheetAnimation, overlayAnimation } = this.state

    const statusBar = PickingService.platformLazy({
      android: () => <StatusBar />,
    })

    const opacityInterpolation = overlayAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.7],
    })

    const overlayStyle = { opacity: opacityInterpolation }

    const bodyStyle = {
      height: this.translateY,
      transform: [{ translateY: sheetAnimation }],
    }

    const optionList = listWithSeparators(map(options, this.renderOption), this.renderSeparator)

    return (
      <Modal
        visible={isVisible}
        animationType="none"
        transparent
        onRequestClose={this.handleCancel}
      >
        {statusBar}

        <Container>
          <Overlay onPress={this.handleCancel}>
            <OverlayBackground as={Animated.View} style={overlayStyle} />
          </Overlay>

          <Body as={Animated.View} style={bodyStyle}>
            <Header>
              <HeaderTitle>{title}</HeaderTitle>
            </Header>

            <Content scrollEnabled={this.scrollEnabled}>{optionList}</Content>
          </Body>
        </Container>
      </Modal>
    )
  }
}

ListSheetComponent.propTypes = {
  maxHeight: PT.number, // eslint-disable-line
  multiple: PT.bool,
  options: PT.array,
  selectedOptions: PT.array,
  title: PT.string.isRequired,
  onChange: PT.func.isRequired,
}

ListSheetComponent.defaultProps = {
  maxHeight: null,
  multiple: false,
  options: [],
  selectedOptions: [],
}

export const ListSheet = withTheme(ListSheetComponent)
