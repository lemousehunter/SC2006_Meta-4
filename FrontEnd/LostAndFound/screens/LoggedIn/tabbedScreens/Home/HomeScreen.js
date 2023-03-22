import BaseLoggedInScreen from '../../BaseLoggedInScreen';
import {Text, View} from 'react-native';

export default class HomeScreen extends BaseLoggedInScreen {
  constructor(props) {
    super(props);
    console.log('props:' + this.props);
  }

  render() {
    console.log('User is:' + this.getUser());

  }
}
