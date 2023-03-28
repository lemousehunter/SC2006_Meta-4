
import {Text, View} from 'react-native';
import {AppContext} from '../../../../contexts/Contexts';
import BaseScreen from '../../../BaseScreen';

export default class Search extends BaseScreen {
  constructor(props) {
    super(props);
    console.log('props:' + this.props);
  }

  //static contextType = AppContext;

  render() {
   //console.log('User is:' + this.getUser());
    return (
      <View>
        <Text>Search</Text>
      </View>
    );
  }
}
