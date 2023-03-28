import {Text, View} from 'react-native';
import {AppContext} from '../../../../contexts/Contexts';
import BaseScreen from '../BaseScreen';

export default class BaseLoggedInScreen extends BaseScreen {
  constructor(props) {
    super(props);
    // console.log(this.props);
  }

  //static contextType = AppContext;

  getUser() {
    return this.getLoginController().getUser();
  }

  logOut() {
    this.getLoginController().logOut();
    this.navigate('PreLoginHomepage', this.getParams());
  }

  render() {
    console.log('User is:' + this.getLoginController().getUser());
    //console.log('User is:' + this.getUser());
    //this.getBottomNav();
    //console.log('homeScreen user:' + this.getUser());
  }
}
