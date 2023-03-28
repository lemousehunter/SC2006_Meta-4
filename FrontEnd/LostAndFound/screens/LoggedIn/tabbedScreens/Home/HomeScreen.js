
import {Text, View} from 'react-native';
import {AppContext} from '../../../../contexts/Contexts';
import BaseScreen from '../../../BaseScreen';
import BaseLoggedInScreen from '../../BaseLoggedInScreen';

export default class HomeScreen extends BaseLoggedInScreen {
  constructor(props) {
    super(props);
    // console.log(this.props);
  }

  render() {
    console.log('User is:' + this.getUser());
    //console.log('User is:' + this.getUser());
    //this.getBottomNav();
    //console.log('homeScreen user:' + this.getUser());
  }
}
