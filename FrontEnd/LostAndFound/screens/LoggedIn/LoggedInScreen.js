import NavBar from '../../components/NavBar';
import {AppContext} from '../../contexts/Contexts';
import BaseScreen from '../BaseScreen';

/**
 * Represents a screen that is shown to the user after they have logged in. 
 * This screen includes a navigation bar and other information that is specific 
 * to the logged-in user, such as their username and location.
 */
export default class LoggedInScreen extends BaseScreen {

  /**
   * Creates a new LoggedInScreen object.
   * 
   * @param props the props passed to this component
   */
  constructor(props) {
    super(props);
    console.log('logged in props:');
    console.log(props);
    //console.log('props:' + this.props);
    this.initialParams = {
      bgColor: this.getBgColor(),
      winW: this.getWinW(),
      winH: this.getWinH(),
      primaryColor: this.getPrimaryColor(),
      secondaryColor: this.getSecondaryColor(),
      callColor: this.getCallColor(),
      buttonFont: this.getButtonFont(),
      userName: 'testUserName',
      location: 'testLoc',
      category: 'testCat',
      desc: 'testDesc',
      date: 'testDate',
    };
  }

  static contextType = AppContext;

  /**
   * Gets the navigation bar for this screen.
   * 
   * @return a NavBar component
   */
  getNavBar() {
    return (
      <NavBar
        activeColor={'#e32f45'}
        normalColor={'#748c94'}
        navBarColor={'#ffffff'}
        user={this.user}
        initialParams={this.initialParams}
      />
    );
  }

  /**
   * Renders the component.
   * 
   * @return the navigation bar for this screen
   */
  render() {
    //console.log('c:');
    //console.log('loggedIn user: ' + this.getLoginController().getUser());
    //console.log(this.getScreensArray());
    return this.getNavBar();
  }
}
