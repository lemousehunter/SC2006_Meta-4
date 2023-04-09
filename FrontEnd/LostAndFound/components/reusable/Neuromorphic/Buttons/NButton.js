import React from 'react';
import {Pressable} from 'react-native';
import NCard from '../Cards/NCard';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import ButtonLabel from './ButtonLabel';

/**
 * A React Native button component that uses NCard and Animated from 'react-native-reanimated'.
 */
export default class NButton extends React.PureComponent {
  /**
   * Constructs a new NButton component with the specified props.
   *
   * @param {Object} props The props for this component.
   * @param {Object} props.settings The settings for the NCard component.
   * @param {string} props.label The label text for the button.
   * @param {string} props.textColor The color of the label text.
   * @param {string} props.fontFamily The font family for the label text.
   * @param {function} props.onPress The callback function to be called when the button is pressed.
   * @param {boolean} props.disabled Whether the button should be disabled or not.
   * @param {boolean} props.blur Whether the button should have a blur effect or not.
   * @param {boolean} props.circle Whether the button should be circular or not.
   */
  constructor(props) {
    super(props);
    this.settings = this.props.settings;
    console.log('settings:');
    console.log(this.settings);
    this.label = this.props.label;
    this.textColor = this.props.textColor;
    this.fontFamily = this.props.fontFamily;
    this.onPress = this.props.onPress;
    this.state = {pressing: false};
    this.getDefaults();
    this.settings = {
      ...this.settings,
      innerShadow: !!this.state.pressing,
      blur: this.blur,
      shadowRadius: this.shadowRadius,
    };
  }


  /**
   * Gets the NCard component to be displayed as the button.
   *
   * @return {JSX.Element} The NCard component with the ButtonLabel component as its child.
   */
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

  /**
   * Sets the default values for any unspecified props.
   */
  getDefaults() {
    this.blur = this.props.blur == null ? true : this.props.blur;
    this.circle = this.props.circle == null ? false : this.props.circle;
    this.shadowRadius =
      this.settings.shadowRadius == null ? 4 : this.settings.shadowRadius;
  }

   /**
   * Renders the NButton component with a Pressable wrapper.
   *
   * @return {JSX.Element} The rendered NButton component.
   */
  render() {
    const Card = () => this.getCard();
    console.log('button state:', this.props.disabled);
    return (
      <Pressable
        disabled={this.props.disabled}
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
