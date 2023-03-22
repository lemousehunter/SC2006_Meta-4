import {Dimensions, Text, View} from 'react-native';
import NButton from '../../components/reusable/NButton';
import BaseScreen from '../BaseScreen';
import HomeScreen from '../LoggedIn/tabbedScreens/Home/HomeScreen';

export default class LoginPage extends BaseScreen {
  constructor(props) {
    super(props);
  }
  render() {
    console.log('par:');
    console.log(this.screensArray);
    return (
      <View>
        <Text>Login Page</Text>
        <NButton
          label={'Back'}
          rectangular
          color={this.getBgColor()}
          width={this.getWinW() * 0.8 * 0.8}
          height={this.getWinH() * 0.8 * 0.1}
          onPress={() => this.navigate('PreLoginHomepage')}
        />
        <NButton
          label={'Login'}
          rectangular
          color={this.getBgColor()}
          width={this.getWinW() * 0.8 * 0.8}
          height={this.getWinH() * 0.8 * 0.1}
          onPress={() =>
            this.navigate('LoggedInScreen', {
              user: 'test',
            })
          }
        />
      </View>
    );
  }
}
