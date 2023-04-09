import {Component} from 'react';
import NCardRectangle from './NCardRectangle';
import NCardCircle from './NCardCircle';

/**
 * A custom card component that renders either a rectangle or a circle based on the `circle` prop.
 *
 * @param {Object} props - The props object that contains the following properties:
 *   @param {Object} settings - The settings object for the card.
 *   @param {boolean} [circle=false] - A boolean value indicating whether the card should be a circle or a rectangle. If `true`, the card will be rendered as a circle. If `false` or not provided, the card will be rendered as a rectangle.
 *   @param {any} children - The children nodes to be rendered within the card.
 */
export default class NCard extends Component {
  constructor(props) {
    super(props);
    //console.log('settings:');
    this.settings = this.props.settings;
    //console.log(this.settings);
    this.circle = this.props.circle == null ? false : this.props.circle;
    //this.innerShadow = this.props.innerShadow;
    console.log('innerShadow:');
    console.log(this.innerShadow);
  }

  /**
   * Renders the NCard component.
   *
   * @returns {JSX.Element} The rendered card component.
   */
  render() {
    const NComponent = this.circle ? NCardCircle : NCardRectangle;
    //console.log('NComponent?');
    //console.log(NComponent);
    return (
      <NComponent settings={this.settings}>
        {this.props.children}
      </NComponent>
    );
  }
}
