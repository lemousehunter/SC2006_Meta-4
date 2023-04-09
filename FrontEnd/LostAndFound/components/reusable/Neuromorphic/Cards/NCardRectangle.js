import NCardBase from './NCardBase';

/**
 * A rectangular card component with customizable border radius.
 * Extends the NCardBase class.
 */
export default class NCardRectangle extends NCardBase {
  /**
   * Creates a new NCardRectangle instance.
   * @param {Object} props - The props for the component.
   * @param {number} [props.borderRadius=20] - The border radius of the card. Default value is 20.
   */
  constructor(props) {
    super(props);
    this.borderRadius = this.borderRadius == null ? 20 : this.borderRadius;
    this.createStylesheet(); // update stylesheet with borderRadius
  }
}
  