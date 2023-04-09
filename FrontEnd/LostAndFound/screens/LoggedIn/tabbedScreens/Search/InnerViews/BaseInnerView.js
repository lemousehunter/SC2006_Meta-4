import React from 'react';
import BaseLoggedInScreen from '../../../BaseLoggedInScreen';

export default class BaseInnerView extends BaseLoggedInScreen {
  constructor(props) {
    super(props);
    this.screenW = this.props.route.params.screenW;
    this.screenH = this.props.route.params.screenH;
    this.tabNav = this.props.route.params.tabNav;
  }

  getScreenW() {
    return this.screenW;
  }

  getScreeH() {
    return this.screenH;
  }

  getTabNav() {
    return this.tabNav;
  }
}
