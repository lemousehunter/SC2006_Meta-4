import {Component} from 'react';

export default class extends Component {
  constructor(props) {
    super(props);
    this.bgColor = this.props.route.params.bgColor;
    this.winW = this.props.route.params.winW;
    this.winH = this.props.route.params.winH;
    this.primaryColor = this.props.route.params.primaryColor;
    this.secondaryColor = this.props.route.params.secondaryColor;
    this.callColor = this.props.route.params.callColor;
    this.buttonFont = this.props.route.params.buttonFont;
    this.navigation = this.props.navigation;
  }

  getBgColor() {
    return this.bgColor;
  }

  getPrimaryColor() {
    return this.primaryColor;
  }

  getSecondaryColor() {
    return this.secondaryColor;
  }

  getCallColor() {
    return this.callColor;
  }

  getWinW() {
    return this.winW;
  }
  getWinH() {
    return this.winH;
  }

  getButtonFont() {
    return this.buttonFont;
  }

  getNav() {
    return this.navigation;
  }

  navigate(screenName, params) {
    this.navigation.navigate(screenName, params);
  }
}
