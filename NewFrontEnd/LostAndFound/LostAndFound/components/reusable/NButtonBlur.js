import NButton from './NButton';
import Animated, {useAnimatedStyle, withSpring} from 'react-native-reanimated';
import NCardBlur from './NCardBlur';
import {Pressable, View} from 'react-native';
import ButtonLabel from './ButtonLabel';

export default class NButtonBlur extends NButton {
  constructor(props) {
    super(props);
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
    const AnimatedNCardBlur = Animated.createAnimatedComponent(NCardBlur);
    let textSize = 14;

    return (
      <Pressable
        onPress={() => {
          onPress();
        }}
        onPressIn={() => {
          this.setState({pressing: true});
          // innerSR.value = 12;
        }}
        onPressOut={() => {
          this.setState({pressing: false});
          // innerSR.value = 0;
        }}>
        <AnimatedNCardBlur
          rectangular={rectangular}
          innerShadow={false}
          color={color}
          width={width}
          height={height}
          radius={radius}
          shadowRadius={this.state.pressing ? -shadowRadius : shadowRadius}>
          <ButtonLabel
            derivedTextSize={this.state.pressing ? 0.8 * textSize : textSize}
            labelText={label}
            color={textColor}
            fontFamily={fontFamily}
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
        </AnimatedNCardBlur>
      </Pressable>
    );
  }
}
