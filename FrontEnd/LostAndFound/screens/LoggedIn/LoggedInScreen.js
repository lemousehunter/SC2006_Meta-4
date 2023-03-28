import NavBar from '../../components/NavBar';
import HomeScreen from './tabbedScreens/Home/HomeScreen';
import Map from './tabbedScreens/Search/Map';
import Search from './tabbedScreens/Search/Search';
import {AppContext} from '../../contexts/Contexts';
import BaseScreen from '../BaseScreen';
export default class LoggedInScreen extends BaseScreen {
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
    };
  }

  static contextType = AppContext;

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

  render() {
    //console.log('c:');
    //console.log('loggedIn user: ' + this.getLoginController().getUser());
    //console.log(this.getScreensArray());
    return this.getNavBar();
  }
}
