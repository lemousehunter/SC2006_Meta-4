import BaseLoggedInScreen from '../../BaseLoggedInScreen';
import {Text, View} from 'react-native';

export default class HomeScreen extends BaseLoggedInScreen {
  constructor(props) {
    super(props);
    // console.log(this.props);
  }

  render() {
    //console.log('User is:' + this.getUser());
    //this.getBottomNav();
    console.log('homeScreen user:' + this.getUser());
  }
}
