
import {Text, View} from 'react-native';
import {AppContext} from '../../../../contexts/Contexts';
import BaseScreen from '../../../BaseScreen';
import BaseLoggedInScreen from '../../BaseLoggedInScreen';
import {Component} from 'react';
import NButton from '../../../../components/reusable/Neuromorphic/Buttons/NButton';

export default class HomeScreen extends BaseLoggedInScreen {
  constructor(props) {
    super(props);
    // console.log(this.props);
    this.createSettings();
  }

  createSettings() {
    this.nSettings = {
      btn: {
        color: this.getPrimaryColor(),
        width: this.winW * 0.8,
        height: this.winH * 0.8 * 0.08,
        shadowRadius: 2,
      },
    };
  }

  onPress = () => {
    this.nav('CreatePost', {postID: 'abc'});
  };

  render() {
    console.log('tabNav: ');
    console.log(this.props.navigation);
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <NButton
          onPress={this.onPress}
          settings={this.nSettings.btn}
          label={'Create Post'}
        />
      </View>
    )
  }
}
