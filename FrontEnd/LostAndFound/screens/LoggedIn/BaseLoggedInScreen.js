import BaseScreen from '../BaseScreen';
import {Component} from 'react';

export default class BaseLoggedInScreen extends BaseScreen {
  constructor(props) {
    super(props);
    //console.log('props: ' + this.props);
    this.user = this.props.route.params.user;
    // console.log('u: ' + this.user);
    this.screensArray = this.props.route.params.screensArray;
    console.log('s: ');
    console.log(this.props.route.params.screensArray);
  }

  getUser() {
    return this.user;
  }

  getScreensArray() {
    return this.screensArray;
  }
}
