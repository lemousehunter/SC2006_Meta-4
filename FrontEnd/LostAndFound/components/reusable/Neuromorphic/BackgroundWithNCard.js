import {Component} from 'react';
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import NCard from './Cards/NCard';

/**
 * A component that displays a colored background with an NCard on top of it.
 */
export default class BGWithNCard extends Component {

   /**
   * Constructs a new BGWithNCard component with the given props.
   *
   * @param props The props for this component.
   * @param props.bgColor The background color to use.
   * @param props.winW The width of the window.
   * @param props.winH The height of the window.
   */
  constructor(props) {
    super(props);
    this.bgColor = this.props.bgColor;
    this.winW = this.props.winW;
    this.winH = this.props.winH;
    this.nSettings = {
      nCardContainer: {
        justifyContent: 'flex-start',
        color: this.bgColor,
        width: this.winW * 0.8,
        height: this.winH * 0.8,
        innerPadding: 40,
        flexDirection: 'column',
        shadowRadius: 4,
        blur: true,
      },
    };
    this.styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: this.bgColor,
        alignItems: 'center',
        justifyContent: 'center',
      },
    });
  }

  /**
   * Renders the BGWithNCard component.
   *
   * @returns The rendered component.
   */
  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={this.styles.container}>
          {/* eslint-disable-next-line react/react-in-jsx-scope */}
          <NCard settings={this.nSettings.nCardContainer}>
            {this.props.children}
          </NCard>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
