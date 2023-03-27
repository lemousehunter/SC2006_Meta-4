import {Component} from 'react';
import NCardRectangle from './NCardRectangle';
import NCardCircle from './NCardCircle';

export default class NCard extends Component {
  constructor(props) {
    super(props);
    //console.log('settings:');
    this.settings = this.props.settings;
    //console.log(this.settings);
    this.circle = this.props.circle == null ? false : this.props.circle;
    this.innerShadow = this.props.innerShadow;
    console.log('innerShadow:');
    console.log(this.innerShadow);
  }

  render() {
    const NComponent = this.circle ? NCardCircle : NCardRectangle;
    //console.log('NComponent?');
    //console.log(NComponent);
    return (
      <NComponent innerShadow={this.innerShadow} settings={this.settings}>
        {this.props.children}
      </NComponent>
    );
  }
}
