import React, {useState} from 'react';
import {Pressable, StyleSheet, View, Text} from 'react-native';
import NCard from './NCard';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import ButtonLabel from './ButtonLabel';

export default class NButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {pressing: false};
  }
  render() {
    const {
      label,
      rectangular,
      color,
      width,
      height,
      radius,
      onPress,
      shadowRadius,
      textColor,
      fontFamily,
    } = this.props;
    const dimRatio = width < height ? width / height : height / width;
    const innerRatio = 1;
    const oInnerW = width * innerRatio;
    const oInnerH = height * innerRatio;
    const innerW = oInnerW < oInnerH ? oInnerW * 0.9 * dimRatio * 0.9 : oInnerW;
    const innerH = oInnerW < oInnerH ? oInnerH * 0.9 * dimRatio : oInnerH * 0.9;
    const shadowR = shadowRadius == null ? 2 : shadowRadius;
    const AnimatedNCard = Animated.createAnimatedComponent(NCard);
    let textSize = 14;

    return (
      <Pressable
        onPress={() => {
          if (onPress != null) {
            onPress();
          }
        }}
        onPressIn={() => {
          this.setState({pressing: true});
          // innerSR.value = 12;
        }}
        onPressOut={() => {
          this.setState({pressing: false});
          // innerSR.value = 0;
        }}>
        <AnimatedNCard
          rectangular={rectangular}
          innerShadow={!!this.state.pressing}
          color={color}
          width={width}
          height={height}
          radius={radius}
          shadowRadius={shadowRadius}>
          <ButtonLabel
            derivedTextSize={this.state.pressing ? 0.8 * textSize : textSize}
            labelText={label}
            color={textColor}
          />
          {/*  rectangular={rectangular}*/}
          {/*  innerShadow={true}*/}
          {/*  color={color}*/}
          {/*  width={innerW}*/}
          {/*  height={innerH}*/}
          {/*  radius={radius}*/}
          {/*  borderRadius={14}*/}
          {/*  shadowRadius={this.state.pressing ? 3 : 0}>*/}
          {/*  <ButtonLabel*/}
          {/*    derivedTextSize={this.state.pressing ? 0.8 * textSize : textSize}*/}
          {/*    labelText={label}*/}
          {/*  />*/}
          {/*</NCard>*/}
        </AnimatedNCard>
      </Pressable>
    );
  }
}
