import {Dimensions, Text, View} from 'react-native';
import NButton from '../../components/reusable/NButton';
import BaseScreen from '../BaseScreen';

export default class RegisterPage extends BaseScreen {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View>
        <Text>Register Page</Text>
        <NButton
          label={'Back'}
          rectangular
          color={this.getBgColor()}
          width={this.getWinW() * 0.8 * 0.8}
          height={this.getWinH() * 0.8 * 0.1}
          onPress={() => this.navigate('PreLoginHomepage')}
        />
      </View>
    );
  }
}
