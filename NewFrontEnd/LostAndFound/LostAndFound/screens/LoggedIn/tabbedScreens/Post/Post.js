import BaseLoggedInScreen from '../../BaseLoggedInScreen';
import {Text, View} from 'react-native';

export default class Post extends BaseLoggedInScreen {
  constructor(props) {
    super(props);
    console.log('props:' + this.props);
  }

  render() {
    console.log('User is:' + this.getUser());
    return (
      <View>
        <Text>Posts</Text>
      </View>
    );
  }
}
