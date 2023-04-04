import {Component} from 'react';

export default class LoginController extends Component {
  constructor(dataC) {
    super(dataC);
    this.user = '';
    this.loggedIn = false;
    this.dataController = dataC;
    this.urlBase = 'users';
  }

  getUser() {
    return this.user;
  }

  getLoggedIn() {
    return this.loggedIn;
  }

  checkUser(user) {
    // checks if user exists
    let check = user === 'hello';
    //let check = true; // to be replaced with checking fn
    return check;
  }

  checkPassword(user, password) {
    // checks if the password for user specified is correct
    let check = this.checkUser(user) && password === 'world';
    //let check = true; // to be replaced with checking fn
    return check;
  }

  register(username, email, password, phoneNumber) {
    console.log(
      'usn:' +
        username +
        ' | email:' +
        email +
        ' | pwd:' +
        password +
        '| phoneNum: ' +
        phoneNumber,
    );
    const res_array = [];
    if (
      username.length === 0 ||
      email.length === 0 ||
      password.length === 0 ||
      phoneNumber.length === 0
    ) {
      if (username.length === 0) {
        res_array.push(', Username');
      }

      if (email.length === 0) {
        res_array.push(', Email');
      }

      if (password.length === 0) {
        res_array.push(', Password');
      }

      if (phoneNumber.length === 0) {
        res_array.push(', Phone Number');
      }

      return res_array.join('|');
    } else {
      if (this.checkUser(username)) {
        return 'E_USN';
      } else {
        // add code for POST-ing data to server
        return 'S';
      }
    }
  }

  async login(user, password) {
    // -4: both username and password left empty, -3: password left empty,-2: user left empty, -1: user does not exist, 0: user exists but incorrect password, 1: login successful
    console.log('logging in.....');
    console.log('dataController:' + this.dataController);
    let num = -1;
    if (user.length === 0 || password.length === 0) {
      if (user.length === 0) {
        num -= 1;
      }
      if (password.length === 0) {
        num -= 2;
      }
      return num;
    } else {
      const response = await this.dataController
        .post(this.urlBase + '/login', {
          email: user,
          password: password,
        })
        .then(res => {
          console.log('loginControllerRes:' + JSON.stringify(res));
          return res;
        })
        .catch(error =>
          console.log('loginControllerError:' + JSON.stringify(error)),
        );
      const status = response.status;
      const body = response.data;
      console.log('body is:' + JSON.stringify(body));
      const msg = body.message;
      console.log('status is:' + JSON.stringify(status));
      console.log('msg is: ' + JSON.stringify(msg));
      if (status === 401) {
        if (msg === 'User not found') {
          return -1;
        } else {
          console.log('returning 0');
          return 0;
        }
      }
      if (status === 200) {
        console.log('returning 1');
        return 1;
      }
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
