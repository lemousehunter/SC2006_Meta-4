import BaseScreen from '../BaseScreen';
import {Component} from 'react';

export default class BaseLoggedInScreen extends BaseScreen {
  constructor(props) {
    super(props);
    //console.log('props: ' + this.props);
    this.user = this.props.route.params.user;

  }

  getUser() {
    return this.user;
  }

  navigate(screenName, params) {
    console.log('current user: ' + this.user);
    let _params = JSON.parse(params);
    _params = {
      ..._params,
      user: this.user,
    };
    super.navigate(screenName, _params);
  }
}
