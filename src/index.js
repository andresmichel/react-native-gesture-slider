import React from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Animated,
} from 'react-native'
import GestureHandler from 'react-native-gesture-handler'

const { PanGestureHandler, TapGestureHandler } = GestureHandler

export default class GestureSlider extends React.PureComponent {
  constructor(props) {
    super(props)
    this.panGestureRef = React.createRef()
    this.state = {
      y: new Animated.Value(0),
    }
    this.state.y.addListener(({ value }) => this._onGestureEvent(value))
    this.index = 0
    this.height = 0
  }

  _onGestureEvent(value) {
    const newIndex = Number.parseInt(value / (this.height / this.props.maximumValue))
    if (newIndex <= this.props.maximumValue && newIndex >= this.props.minimumValue) {
      if (this.index !== newIndex) {
        this.index = newIndex
        if (this.props.onValueChange) {
          this.props.onValueChange(newIndex)
          if (newIndex === this.props.maximumValue) {
            if (this.props.onSlidingComplete) {
              this.props.onSlidingComplete()
            }
          }
        }
      }
    }
  }

  render() {
    const { y } = this.state
    const { style, ...props } = this.props
    return (
      <TapGestureHandler
        onHandlerStateChange={Animated.event([{ nativeEvent: { y } }])}
        waitFor={this.panGestureRef}
      >
        <PanGestureHandler
          ref={this.panGestureRef}
          onGestureEvent={Animated.event([{ nativeEvent: { y } }])}
        >
          <View
            {...props}
            onLayout={(event) => {
              const { height } = event.nativeEvent.layout
              this.height = height
            }}
          />
        </PanGestureHandler>
      </TapGestureHandler>
    )
  }
}

GestureSlider.propTypes = {
  minimumValue: PropTypes.number.isRequired,
  maximumValue: PropTypes.number.isRequired,
  onValueChange: PropTypes.func,
  onSlidingComplete: PropTypes.func,
  value: PropTypes.number,
  step: PropTypes.number,
  disabled: PropTypes.bool,
}

GestureSlider.defaultProps = {
  minimumValue: 0,
  maximumValue: 10,
  step: 1,
}
