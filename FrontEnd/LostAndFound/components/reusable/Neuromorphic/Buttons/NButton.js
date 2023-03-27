import React from 'react';
import {Pressable} from 'react-native';
import NCard from '../Cards/NCard';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import ButtonLabel from './ButtonLabel';

export default class NButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.settings = this.props.settings;
    console.log('settings:');
    console.log(this.settings);
    this.label = this.props.label;
    this.textColor = this.props.textColor;
    this.fontFamily = this.props.fontFamily;
    this.onPress = this.props.onPress;
    this.state = {shadowRadius: this.settings.shadowRadius};
    this.state = {pressing: false};
    this.getDefaults();
    this.settings = {
      ...this.settings,
      innerShadow: !!this.state.pressing,
      blur: this.blur,
      shadowRadius: this.shadowRadius,
    };
  }

  getCard() {
    let textSize = 14;
    return (
      <NCard circle={this.circle} settings={this.settings}>
        <ButtonLabel
          derivedTextSize={this.state.pressing ? 0.8 * textSize : textSize}
          labelText={this.label}
          color={this.textColor}
        />
      </NCard>
    );
  }

  getDefaults() {
    this.blur = this.props.blur == null ? true : this.props.blur;
    this.circle = this.props.circle == null ? false : this.props.circle;
    this.shadowRadius =
      this.settings.shadowRadius == null ? 4 : this.settings.shadowRadius;
  }

  render() {
    const Card = () => this.getCard();

    return (
      <Pressable
        onPress={() => {
          if (this.onPress != null) {
            this.onPress();
          }
        }}
        onPressIn={() => {
          this.setState({pressing: true});
          //this.settings.innerShadow = true;
          this.settings.shadowRadius = -this.settings.shadowRadius;
        }}
        onPressOut={() => {
          this.setState({pressing: false});
          //this.settings.innerShadow = false;
          this.settings.shadowRadius = -this.settings.shadowRadius;
        }}>
        <Card></Card>
      </Pressable>
    );
  }
}
