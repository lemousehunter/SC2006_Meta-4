import BaseScreen from '../BaseScreen';

/**
 * A screen that requires the user to be logged in.
 * Extends the {@link BaseScreen} class.
 */
export default class BaseLoggedInScreen extends BaseScreen {

  /**
   * Creates a new BaseLoggedInScreen.
   * @param {object} props - The props passed to the component.
   */
  constructor(props) {
    super(props);
    // console.log(this.props);
  }

  //static contextType = AppContext;

  /**
   * Returns the currently logged-in user.
   * @return {object} - An object representing the current user.
   */
  getUser() {
    return this.getLoginController().getUser();
  }

  /**
   * Logs out the current user and navigates to the pre-login homepage.
   */
  logOut() {
    this.getLoginController().logOut();
    this.navigate('PreLoginHomepage', this.getParams());
  }

  /**
   * Returns the posts controller.
   * @return {object} - The posts controller.
   */
  getPostsController = () => {
    return this.getControllers().postsController;
  };

  /**
   * Returns the reports controller.
   * @return {object} - The reports controller.
   */
  getReportsController = () => {
    return this.getControllers().reportsController;
  };

  /**
   * Returns the requests controller.
   * @return {object} - The requests controller.
   */
  getRequestsController = () => {
    return this.getControllers().requestsController;
  };

  /**
   * Navigates to the specified tab screen.
   * @param {string} tabScreenName - The name of the tab screen to navigate to.
   * @param {object} params - The parameters to pass to the tab screen.
   */
  nav = (tabScreenName, params) => {
    console.log('jumping to:', tabScreenName);
    this.props.navigation.jumpTo(tabScreenName, params);
  };

  /**
   * Renders the component.
   * Displays the currently logged-in user and logs additional debug information.
   */
  render() {
    console.log('TabUser is:' + this.getLoginController().getUser());
    //console.log('User is:' + this.getUser());
    //this.getBottomNav();
    //console.log('homeScreen user:' + this.getUser());
  }
}
