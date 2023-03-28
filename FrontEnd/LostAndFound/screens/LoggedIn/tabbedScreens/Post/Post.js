
import {Text, View} from 'react-native';
import {AppContext} from '../../../../contexts/Contexts';
import BaseScreen from '../../../BaseScreen';

export default class Post extends BaseScreen {
  constructor(props) {
    super(props);
    console.log('props:' + this.props);
  }

  //static contextType = AppContext;

  render() {
    console.log('User is:' + this.getLoginController().getUser());
    return (
      <View>
        <Text>Posts</Text>
      </View>
    );
  }
}
