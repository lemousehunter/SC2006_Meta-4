import {Text, View} from 'react-native';
import {AppContext} from '../../../../contexts/Contexts';
import BaseScreen from '../../../BaseScreen';
import {StyleSheet} from 'react-native';
import NButton from '../../../../components/reusable/Neuromorphic/Buttons/NButton';
import React from 'react';

export default class AccountScreen extends BaseScreen {
  constructor(props) {
    super(props);
    this.createStylesheet();
    this.createSettings();
  }

  createStylesheet() {
    this.styles = StyleSheet.create({
      mainContainer: {
        justifyContent: 'center',
        alignItems: 'center',
      },
    });
  }

  createSettings() {
    this.nSettings = {
      logoutBtn: {
        color: this.getPrimaryColor(),
        width: this.getWinW() * 0.8 * 0.8,
        height: this.getWinH() * 0.8 * 0.1,
        shadowRadius: 2,
      },
    };
  }
  //static contextType = AppContext;

  render() {
    console.log('width' + this.getWinW());
    console.log('height' + this.getWinH());
    console.log('props:' + JSON.stringify(this.props));
    return (
      <View style={this.styles.mainContainer}>
        <Text>Account</Text>
        <NButton
          settings={this.nSettings.logoutBtn}
          onPress={() => this.navigate('PreLoginHomepage')}
          label={'Logout'}
          fontFamily={this.getButtonFont()}
          textColor={this.getSecondaryColor()}
        />
      </View>
    );
  }
}
