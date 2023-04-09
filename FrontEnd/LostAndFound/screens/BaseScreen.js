import {Component} from 'react';
import {AppContext} from '../contexts/Contexts';

/**
 * This is a React component that renders a screen with custom colors and dimensions.
 * It retrieves its configuration parameters from its route props and uses them to set its own state.
 * It also has access to the app context and provides methods to retrieve controllers and navigate to other screens.
 */
export default class extends Component {
  /**
   * Constructs a new CustomScreen component with the given props.
   *
   * @param props the route props for this screen
   */
  constructor(props) {
    super(props);
    this.bgColor = this.props.route.params.bgColor;
    this.winW = this.props.route.params.winW;
    this.winH = this.props.route.params.winH;
    this.primaryColor = this.props.route.params.primaryColor;
    this.secondaryColor = this.props.route.params.secondaryColor;
    this.callColor = this.props.route.params.callColor;
    this.buttonFont = this.props.route.params.buttonFont;
    // this.navigation = this.props.navigation;
    // this.loginController = this.context.nav;
  }

  /**
   * The app context used by this component.
   *
   * @type {AppContext}
   */
  static contextType = AppContext;

  /**
   * Returns the background color of this screen.
   *
   * @returns {string} the background color
   */
  getBgColor() {
    return this.bgColor;
  }

  /**
   * Returns the primary color used by this screen.
   *
   * @returns {string} the primary color
   */
  getPrimaryColor() {
    return this.primaryColor;
  }

  /**
   * Returns the secondary color used by this screen.
   *
   * @returns {string} the secondary color
   */
  getSecondaryColor() {
    return this.secondaryColor;
  }

  /**
   * Returns the color used for the call-to-action button on this screen.
   *
   * @returns {string} the call-to-action button color
   */
  getCallColor() {
    return this.callColor;
  }

  /**
   * Returns the width of the screen.
   *
   * @returns {number} the screen width
   */
  getWinW() {
    return this.winW;
  }

  /**
   * Returns the height of the screen.
   *
   * @returns {number} the screen height
   */
  getWinH() {
    return this.winH;
  }

  /**
   * Returns the font used for buttons on this screen.
   *
   * @returns {string} the button font
   */
  getButtonFont() {
    return this.buttonFont;
  }

  /**
   * Returns the parameters stored in the app context.
   *
   * @returns {Object} the app context parameters
   */
  getParams() {
    return this.context.params;
  }

  /**
   * Returns the controllers stored in the app context.
   *
   * @returns {Object} the app context controllers
   */
  getControllers = () => {
    return this.context.controllers;
  };

  /**
   * Returns the login controller from the app context.
   *
   * @returns {Object} the login controller
   */
  getLoginController() {
    return this.getControllers().loginController;
  }

  /**
   * Returns the current navigation object from the app context controllers.
   *
   * @returns {Object} the navigation object
   */
  getNav() {
    return this.getControllers().nav.current;
  }

  /**
 * Navigates to a specified screen with the given parameters.
 *
 * @param screenName The name of the screen to navigate to.
 * @param params     The parameters to pass to the screen being navigated to.
 * @return           void
 */
  navigate(screenName, params) {
    this.getNav().navigate(screenName, params);
  }
}
