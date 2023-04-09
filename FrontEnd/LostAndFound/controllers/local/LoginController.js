import {Component} from 'react';

/**

This class represents a controller for user authentication and registration.
It extends the Component class from the react library and exports it as the default component.
*/
export default class LoginController extends Component {

/**
Constructs a new instance of the LoginController class with the provided dataC parameter.
@param {object} dataC - The data controller to use for making API calls.
*/
  constructor(dataC) {
    super(dataC);
    this.user = '';
    this.loggedIn = false;
    this.dataController = dataC;
    this.urlBase = 'users';
  }

  /**
  Returns the current user of the login controller.
  @returns {string} - The current user of the login controller.
  */
  getUser() {
    return this.user;
  }

  /**
  Returns whether or not a user is currently logged in to the controller.
  @returns {boolean} - true if a user is logged in, false otherwise.
  */
  getLoggedIn() {
    return this.loggedIn;
  }

  /**
  Checks whether a given user exists in the system.
  @param {string} user - The user to check.
  @returns {boolean} - true if the user exists, false otherwise.
  */
  checkUser(user) {
    // checks if user exists
    let check = user === 'hello';
    //let check = true; // to be replaced with checking fn
    return check;
  }


  /**
  Checks whether a given password is correct for the specified user.
  @param {string} user - The user for which to check the password.
  @param {string} password - The password to check.
  @returns {boolean} - true if the password is correct, false otherwise.
  */
  checkPassword(user, password) {
    // checks if the password for user specified is correct
    let check = this.checkUser(user) && password === 'world';
    //let check = true; // to be replaced with checking fn
    return check;
  }

  /**

Registers a new user with the provided information.
@param {string} username - The username of the new user.
@param {string} email - The email address of the new user.
@param {string} password - The password of the new user.
@param {string} phoneNumber - The phone number of the new user.
@returns {string} - The result of the registration attempt, either 'S' for success or an error code otherwise.
*/
  async register(username, email, password, phoneNumber) {
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
      console.log('registering....');
      console.log('dataController:' + JSON.stringify(this.dataController));
      const response = await this.dataController
        .post(this.urlBase + '/register', {
          name: username,
          email: email,
          password: password,
          phone: phoneNumber,
        })
        .then(res => {
          console.log('loginControllerRes:' + JSON.stringify(res));
          return res;
        })
        .catch(error =>
          console.log('loginControllerError:' + JSON.stringify(error)),
        );
      console.log('response is :' + JSON.stringify(response));
      if (response.status === 201) {
        return 'S';
      } else {
        console.log('E_USN');
        return 'E_USN';
      }
    }
  }
  /**
Retrieves a list of users with a matching name.
@param name the name to search for
@return a list of users with a matching name
*/
  async getUserListByName(name) {
    console.log('getting user by name...');
    const response = await this.dataController
      .get(this.urlBase + '/search/' + name)
      .then(result => {
        console.log('userList:' + JSON.stringify(result));
        return result;
      });
    return response.data;
  }

  /**
Returns the user with the specified ID.
@param userID the ID of the user to retrieve
@return the user with the specified ID
*/
  async getUserByID(userID) {
    console.log('getting user by id...');
    const response = await this.dataController
      .get(this.urlBase + '/' + userID)
      .then(result => {
        return result;
      });
    return response.data;
  }

  /**
 * Attempts to log in the user with the specified username and password.
 *
 * @param user the username or email address of the user attempting to log in
 * @param password the password of the user attempting to log in
 * @return an integer indicating the result of the login attempt:
 *         -4: both username and password left empty,
 *         -3: password left empty,
 *         -2: user left empty,
 *         -1: user does not exist,
 *          0: user exists but incorrect password,
 *          1: login successful
 */
  async login(user, password) {
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
      console.log('status is:' + JSON.stringify(status));
      if (status === 401) {
        const msg = body.message;
        if (msg === 'User not found') {
          return -1;
        } else {
          console.log('returning 0');
          return 0;
        }
      }
      if (status === 200) {
        console.log('returning 1');
        this.user = body.id;
        this.dataController.sessionToken = body.token;
        return 1;
      }
    }
  }

  /**
Logs the user out by resetting the user and loggedIn properties to their default values.
@param user the user to be logged out
*/
  logout(user) {
    this.user = '';
    this.loggedIn = false;
  }

  /**
Renders the component and its child components to the DOM.
@return a React element representing the component and its child components
*/
  render() {
    return this.props.children;
  }
}
