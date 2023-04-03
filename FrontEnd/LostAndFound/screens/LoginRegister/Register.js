import {Alert, Dimensions, StyleSheet, Text, View} from 'react-native';
import NButton from '../../components/reusable/Neuromorphic/Buttons/NButton';
import BaseScreen from '../BaseScreen';
import HomeScreen from '../LoggedIn/tabbedScreens/Home/HomeScreen';
import BGWithNCard from '../../components/reusable/Neuromorphic/BackgroundWithNCard';
import {AppContext} from '../../contexts/Contexts';
import NTextInput from '../../components/reusable/Neuromorphic/TextInput/NTextInput';
import React from 'react';

export default class RegisterPage extends BaseScreen {
  constructor(props) {
    super(props);
    this.createStyleSheet();
    this.getSettings();
    this.createRefs();
  }

  static contextType = AppContext;
  createStyleSheet() {
    this.style = StyleSheet.create({
      mainContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 4,
      },
      titleContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 2,
      },
      btnContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'space-around',
        flex: 2,
        gap: 10,
      },
      btnSpacer: {
        flex: 2,
      },
      titleText: {
        color: this.getPrimaryColor(),
        fontFamily: 'SundayBest',
        fontSize: 25,
      },
      fieldsContainer: {
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'space-around',
        flex: 8,
        gap: 10,
      },
    });
  }

  getSettings() {
    this.nSettings = {
      registerBtn: {
        color: this.getPrimaryColor(),
        width: this.getWinW() * 0.8 * 0.35,
        height: this.getWinH() * 0.8 * 0.09,
        shadowRadius: 2,
      },
      backBtn: {
        color: this.getSecondaryColor(),
        width: this.getWinW() * 0.8 * 0.35,
        height: this.getWinH() * 0.8 * 0.09,
        shadowRadius: 2,
      },
      nTextField: {
        color: this.getBgColor(),
        width: this.winW * 0.8 * 0.8,
        height: this.winH * 0.8 * 0.08,
        shadowRadius: 3,
        innerShadow: false,
        blur: false,
      },
    };
  }

  createRefs() {
    this.usn = React.createRef(null);
    this.email = React.createRef(null);
    this.password = React.createRef(null);
    this.phoneNum = React.createRef(null);
  }

  validateRegistration() {
    const usn = this.usn.current.getText();
    const email = this.email.current.getText();
    const pwd = this.password.current.getText();
    const phoneNum = this.phoneNum.current.getText();

    console.log(this.getLoginController());
    const response = this.getLoginController().register(
      usn,
      email,
      pwd,
      phoneNum,
    );
    console.log('response: ' + response);
    if (response === 'S') {
      this.navigate('PreLoginHomepage');
    } else {
      if (response === 'E_USN') {
        Alert.alert(
          'Invalid User',
          'Username chosen exists. Please choose another.',
        );
      } else {
        const res_arr = response.split('|');
        let alert_msg = 'All fields must be filled up. Currently';
        for (let i = 0; i < res_arr.length; i++) {
          alert_msg += res_arr[i];
        }
        if (res_arr.length == 1) {
          alert_msg += ' is not filled. Please try again.';
        } else {
          alert_msg += ' are not filled. Please try again.';
        }
        Alert.alert('Empty Fields', alert_msg);
      }
    }
  }

  render() {
    return (
      <BGWithNCard
        winW={this.getWinW()}
        winH={this.getWinH()}
        bgColor={this.getBgColor()}>
        <View style={this.style.titleContainer}>
          <Text style={this.style.titleText}>Register</Text>
        </View>
        <View style={this.style.fieldsContainer}>
          <NTextInput
            settings={this.nSettings.nTextField}
            placeholder={'Username'}
            ref={this.usn}
          />
          <NTextInput
            settings={this.nSettings.nTextField}
            placeholder={'Email'}
            ref={this.email}
          />
          <NTextInput
            settings={this.nSettings.nTextField}
            placeholder={'Password'}
            ref={this.password}
          />
          <NTextInput
            settings={this.nSettings.nTextField}
            placeholder={'PhoneNumber'}
            ref={this.phoneNum}
          />
        </View>
        <View style={this.style.btnContainer}>
          <NButton
            onPress={() => this.validateRegistration()}
            settings={this.nSettings.registerBtn}
            label={'Register'}
            fontFamily={this.getButtonFont()}
            textColor={this.getBgColor()}
            style={{alignSelf: 'flex-start'}}
          />
          <View style={this.style.btnSpacer} />
          <NButton
            settings={this.nSettings.backBtn}
            onPress={() => this.navigate('PreLoginHomepage')}
            label={'Back'}
            fontFamily={this.getButtonFont()}
            textColor={this.getPrimaryColor()}
          />
        </View>
      </BGWithNCard>
    );
  }
}
