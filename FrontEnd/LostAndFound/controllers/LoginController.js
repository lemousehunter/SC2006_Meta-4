import {Component} from 'react';

export default class LoginController extends Component {
  constructor(props) {
    super(props);
    this.user = '';
    this.loggedIn = false;
  }

  getUser() {
    return this.state.user;
  }

  getLoggedIn() {
    return this.state.loggedIn;
  }

  checkUser(user) {
    // checks if user exists
    let check = user === 'hello';
    //let check = true; // to be replaced with checking fn
    return check;
  }

  checkPassword(user, password) {
    // checks if the password for user specified is correct
    let check = (this.checkUser(user) && password === 'world');
    //let check = true; // to be replaced with checking fn
    return check;
  }

  login(user, password) {
    // -1: user does not exist, 0: user exists but incorrect password, 1: login successful
    if (this.checkUser(user)) {
      if (this.checkPassword(user, password)) {
        this.user = user;
        this.loggedIn = true;
        return 1;
      } else {
        return 0;
      }
    } else {
      return -1;
    }
  }

  logout(user) {
    this.user = '';
    this.loggedIn = false;
  }

  render() {
    return this.props.children;
  }
}
