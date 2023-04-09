import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Neomorph, NeomorphBlur} from 'react-native-neomorph-shadows';

/**
 * A custom card component with neomorph shadows for React Native.
 */
export default class NCardBase extends React.PureComponent {

    /**
     * Creates a new instance of the NCardBase component.
     *
     * @param {object} props The props that are passed to the component.
     * @param {object} props.settings The settings for the component, including:
     *   @param {boolean} props.settings.rectangular Whether the card is rectangular or not (currently unused).
     *   @param {boolean} props.settings.innerShadow Whether to show an inner shadow or not.
     *   @param {string} props.settings.color The color of the card.
     *   @param {number} props.settings.width The width of the card.
     *   @param {number} props.settings.height The height of the card.
     *   @param {string} props.settings.justifyContent The horizontal alignment of the card's contents.
     *   @param {string} props.settings.alignItems The vertical alignment of the card's contents.
     *   @param {number} props.settings.innerPadding The amount of padding to add inside the card.
     *   @param {boolean} props.settings.showShadow Whether to show a neomorph shadow or not.
     *   @param {number} props.settings.shadowRadius The radius of the neomorph shadow.
     *   @param {number} props.settings.borderRadius The radius of the card's border.
     *   @param {string} props.settings.flexDirection The direction of the card's contents (row or column).
     */
  constructor(props) {
    // props.settings = {rectangular, innerShadow, color, width, height, justifyContent, alignItems, innnerPadding, showShadow, shadowRadius, borderRadius, flexDirection}
    super(props);
    /**
     * The settings for the component, including:
     * @type {object}
     * @property {boolean} rectangular Whether the card is rectangular or not (currently unused).
     * @property {boolean} innerShadow Whether to show an inner shadow or not.
     * @property {string} color The color of the card.
     * @property {number} width The width of the card.
     * @property {number} height The height of the card.
     * @property {string} justifyContent The horizontal alignment of the card's contents.
     * @property {string} alignItems The vertical alignment of the card's contents.
     * @property {number} innerPadding The amount of padding to add inside the card.
     * @property {boolean} showShadow Whether to show a neomorph shadow or not.
     * @property {number} shadowRadius The radius of the neomorph shadow.
     * @property {number} borderRadius The radius of the card's border.
     * @property {string} flexDirection The direction of the card's contents (row or column).
     * @property {boolean} blur Whether to blur the neomorph shadow or not.
     */
    this.settings = this.props.settings;
    this.setDefaults();
    this.state = {shadowRadius: this.shadowRadius};
    this.createStylesheet();
  }

  /**
   * Creates the stylesheet for the component.
   */
  createStylesheet() {
    this.styles = StyleSheet.create({
      main: {
        shadowRadius: this.showShadow ? this.shadowRadius : 0,
        borderRadius: this.borderRadius,
        backgroundColor: this.color,
        width: this.width,
        height: this.height,
        justifyContent: this.justifyContent,
        alignItems: this.alignItems,
      },
      center: {
        justifyContent: this.justifyContent,
        alignItems: this.alignItems,
      },
      flexDirection: {flexDirection: this.flexDirection},
      padding: {
        padding: this.innerPadding,
      },
    });
  }

  /**
 * Sets the value of the innerShadow property of the NCardBase component.
 * If set to true, an inner shadow will be displayed within the Neomorph component.
 * If set to false, no inner shadow will be displayed.
 *
 * @param {boolean} innerShadow - The value to set the innerShadow property to.
 */
  setInnerShadow(innerShadow) {
    this.innerShadow = innerShadow;
  }

  /**
 * Sets default values for the component's properties that have not been specified by the props.
 * If a property is already set, its value is not changed.
 * The default values are:
 * - width: 10
 * - height: 10
 * - borderRadius: 20
 * - color: #FFF
 * - innerShadow: false
 * - justifyContent: 'center'
 * - alignItems: 'center'
 * - innerPadding: 0
 * - showShadow: true
 * - shadowRadius: 12
 * - flexDirection: 'row'
 * - blur: false
 */
  setDefaults() {
    this.width = this.settings.width == null ? 10 : this.settings.width;
    this.height = this.settings.height == null ? 10 : this.settings.height;
    this.borderRadius =
      this.settings.borderRadius == null ? 20 : this.settings.borderRadius;
    this.color =
      this.settings.color == null ? '#FFF' : (this.color = this.settings.color);
    this.innerShadow =
      this.settings.innerShadow == null ? false : this.settings.innerShadow;
    this.justifyContent =
      this.settings.justifyContent == null
        ? 'center'
        : this.settings.justifyContent;
    this.alignItems =
      this.settings.alignItems == null ? 'center' : this.settings.alignItems;
    this.innerPadding =
      this.settings.innerPadding == null ? 0 : this.settings.innerPadding;
    this.showShadow =
      this.settings.showShadow == null ? true : this.settings.showShadow;
    this.shadowRadius =
      this.settings.shadowRadius == null ? 12 : this.settings.shadowRadius;
    this.flexDirection =
      this.settings.flexDirection == null ? 'row' : this.settings.flexDirection;
    this.blur = this.settings.blur == null ? false : this.settings.blur;
  }

  /**
 * Renders the component to the screen.
 * 
 * @return {ReactElement} A React element representing the component.
 */
  render() {
    const NComponent = this.settings.blur ? NeomorphBlur : Neomorph;
    return (
      <NComponent
        inner={this.innerShadow} // <- enable shadow inside of neomorph
        swapShadows // <- change zIndex of each shadow color
        style={this.styles.main}>
        <View
          style={[
            this.styles.center,
            this.styles.padding,
            this.styles.flexDirection,
          ]}>
          {this.props.children}
        </View>
      </NComponent>
    );
  }
}
