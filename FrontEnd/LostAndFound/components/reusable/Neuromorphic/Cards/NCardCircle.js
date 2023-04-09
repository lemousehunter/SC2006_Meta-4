import NCardBase from './NCardBase';
import {StyleSheet} from 'react-native';

/**
 * A circular card component that extends the NCardBase component.
 */
export default class NCardCircle extends NCardBase {

  /**
   * Constructor for the NCardCircle component.
   *
   * @param {object} props - The props object for the component.
   * @param {object} props.settings - The settings object for the component.
   * @param {number} props.settings.radius - The radius of the circular card.
   * @param {string} props.color - The background color of the card.
   * @param {string} props.justifyContent - The vertical alignment of the card contents.
   * @param {string} props.alignItems - The horizontal alignment of the card contents.
   * @param {string} props.flexDirection - The direction of the card contents.
   * @param {number} props.innerPadding - The amount of padding inside the card.
   */
  constructor(props) {
    super(props);
    this.radius = this.settings.radius;
    this.state = {shadowRadius: this.shadowRadius};
    this.createStylesheet();
  }

   /**
   * Creates the stylesheet for the component.
   * 
     * The stylesheet object for the component.
     * @type {object}
     * @property {object} main - The main style for the circular card.
     * @property {number} main.shadowRadius - The shadow radius of the card.
     * @property {number} main.borderRadius - The border radius of the card.
     * @property {string} main.backgroundColor - The background color of the card.
     * @property {number} main.width - The width of the card.
     * @property {number} main.height - The height of the card.
     * @property {string} main.justifyContent - The vertical alignment of the card contents.
     * @property {string} main.alignItems - The horizontal alignment of the card contents.
     * @property {object} center - The style for centering the contents of the card.
     * @property {string} center.justifyContent - The vertical alignment of the card contents.
     * @property {string} center.alignItems - The horizontal alignment of the card contents.
     * @property {object} flexDirection - The style for the direction of the card contents.
     * @property {string} flexDirection.flexDirection - The direction of the card contents.
     * @property {object} padding - The style for the padding inside the card.
     * @property {number} padding.padding - The amount of padding inside the card.
   */
  createStylesheet() {
    this.styles = StyleSheet.create({
      main: {
        shadowRadius: this.shadowRadius,
        borderRadius: this.radius,
        backgroundColor: this.color,
        width: this.radius * 2,
        height: this.radius * 2,
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
}
