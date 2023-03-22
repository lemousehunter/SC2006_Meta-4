import BaseLoggedInScreen from './BaseLoggedInScreen';
import NavBar from '../../components/NavBar';
import HomeScreen from './tabbedScreens/Home/HomeScreen';
import Map from './tabbedScreens/Search/Map';
import Search from './tabbedScreens/Search/Search';
export default class LoggedInScreen extends BaseLoggedInScreen {
  constructor(props) {
    super(props);
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

  render() {
    //console.log('User is:' + this.getUser());
    //console.log('c:');
    //console.log(this.getScreensArray());
    return (
      <NavBar
        activeColor={'#e32f45'}
        normalColor={'#748c94'}
        navBarColor={'#ffffff'}
        initialParams={this.initialParams}
      />
    );
  }
}
