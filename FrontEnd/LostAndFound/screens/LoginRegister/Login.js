import {
  Dimensions,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import NCard from '../../components/reusable/Neuromorphic/Cards/NCard';
import BaseScreen from '../BaseScreen';
import NButton from '../../components/reusable/Neuromorphic/Buttons/NButton';
import BGWithNCard from '../../components/reusable/Neuromorphic/BackgroundWithNCard';
import NTextInput from '../../components/reusable/Neuromorphic/TextInput/NTextInput';
import React from 'react';
import {AppContext} from '../../components/Context';

export default class Login extends BaseScreen {
  constructor(props) {
    super(props);
    this.props = props;
    this.getStyleSheet();
    this.getNeuromorphicSettings();
    this.state = {
      username: '',
      password: '',
    };
    this.usn = React.createRef(null);
    this.pwd = React.createRef(null);
  }
  static contextType = AppContext;

  getStyleSheet() {
    this.styles = StyleSheet.create({
      imgContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      titleContainer: {
        flex: 1,
        height: this.getWinW() * 0.8 * 0.1,
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'column',
      },
      textFieldContainer: {
        flex: 3,
        justifyContent: 'space-around',
      },
      title: {
        color: this.getPrimaryColor(),
        fontFamily: 'SundayBest',
        fontSize: 25,
      },
      btnContainer: {flex: 3, justifyContent: 'space-around'},
      image: {width: 147, height: 147, borderRadius: 75},
    });
  }

  getNeuromorphicSettings() {
    this.nSettings = {
      circleCard: {
        color: this.getBgColor(),
        radius: 100,
      },
      innerCircleCard: {
        color: this.getBgColor(),
        radius: 80,
      },
      loginBtn: {
        color: this.getPrimaryColor(),
        width: this.getWinW() * 0.8 * 0.8,
        height: this.getWinH() * 0.8 * 0.1,
        shadowRadius: 2,
      },
      registerBtn: {
        color: this.getSecondaryColor(),
        width: this.winW * 0.8 * 0.8,
        height: this.winH * 0.8 * 0.1,
        shadowRadius: 2,
      },
      nTextField: {
        color: this.getBgColor(),
        width: this.winW * 0.8 * 0.8,
        height: this.winH * 0.8 * 0.1,
        shadowRadius: 2,
      },
    };
  }

  render() {
    return (
      // eslint-disable-next-line react/react-in-jsx-scope
      <BGWithNCard
        winW={this.getWinW()}
        winH={this.getWinH()}
        bgColor={this.getBgColor()}>
        <NCard circle={true} settings={this.nSettings.circleCard}>
          <View style={[this.styles.imgContainer]}>
            <NCard circle={true} settings={this.nSettings.innerCircleCard}>
              <Image
                source={require('../../assets/images/logo.png')}
                style={this.styles.image}
              />
            </NCard>
          </View>
        </NCard>
        <View style={this.styles.titleContainer}>
          <Text style={this.styles.title}>Lost & Found</Text>
        </View>
        <View style={this.styles.textFieldContainer}>
          <NTextInput
            settings={this.nSettings.nTextField}
            placeholder={'Username'}
            ref={this.usn}
          />
          <NTextInput
            settings={this.nSettings.nTextField}
            placeholder={'Password'}
            ref={this.pwd}
          />
        </View>
        <View style={this.styles.btnContainer}>
          <NButton
            label={'LOGIN'}
            fontFamily={this.getButtonFont()}
            textColor={this.getBgColor()}
            //onPress={() => this.navigate('LoggedInScreen')}
            onPress={() => {
              //console.log(this.getLoginController());
              //console.log(this.getLoginController().getUser());
              // console.log(refUsn.current.getText());
              //console.log('loginController');
              //console.log(this.getLoginController());
              console.log('refUSN:');
              console.log(this.usn.current);
              const loginState = this.getLoginController().login(
                this.usn.current.getText(),
                this.pwd.current.getText(),
              );

              if (loginState === -1) {
                alert('Username is invalid');
              } else if (loginState === 0) {
                alert('Password is incorrect');
              } else {
                // loginState === 1
                this.navigate('LoggedInScreen');
              }
            }}
            settings={this.nSettings.loginBtn}
          />
          <NButton
            label={'REGISTER'}
            onPress={() => this.navigate('RegisterPage')}
            textColor={this.getPrimaryColor()}
            fontFamily={this.getButtonFont()}
            settings={this.nSettings.registerBtn}
          />
        </View>
      </BGWithNCard>
    );
  }
}
