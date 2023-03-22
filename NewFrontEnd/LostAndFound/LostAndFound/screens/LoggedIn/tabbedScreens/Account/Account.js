import BaseLoggedInScreen from '../../BaseLoggedInScreen';
import {Text, View} from 'react-native';

export default class AccountScreen extends BaseLoggedInScreen {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <Text>Account</Text>
      </View>
    );
  }
}
