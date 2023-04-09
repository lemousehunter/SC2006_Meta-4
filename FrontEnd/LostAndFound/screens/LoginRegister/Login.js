import {Alert, Image, StyleSheet, Text, View} from 'react-native';
import NCard from '../../components/reusable/Neuromorphic/Cards/NCard';
import BaseScreen from '../BaseScreen';
import NButton from '../../components/reusable/Neuromorphic/Buttons/NButton';
import BGWithNCard from '../../components/reusable/Neuromorphic/BackgroundWithNCard';
import NTextInput from '../../components/reusable/Neuromorphic/TextInput/NTextInput';
import React from 'react';
import {AppContext} from '../../contexts/Contexts';

/**
 * A screen component that displays a login page, which allows users to input their
 * username and password in order to log in. It extends the BaseScreen class and
 * implements a contextType for AppContext. The component includes a background with
 * a Neuromorphic card and an image, as well as input fields for the user's username
 * and password and a login button. When the user clicks the login button, the component
 * validates the inputted username and password and logs the user in if the credentials
 * are valid.
 */
export default class LoginPage extends BaseScreen {
  /**
   * Creates a new LoginPage object.
   * @param {Object} props - The props passed to the component.
   */
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

  /**
   * The AppContext object that provides access to global app state.
   * @type {Object}
   */
  static contextType = AppContext;

  /**
   * Initializes the StyleSheet for the component.
   */
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

  /**
   * Initializes the Neuromorphic settings for the component.
   */
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
        height: this.winH * 0.8 * 0.08,
        shadowRadius: 3,
        innerShadow: false,
        blur: false,
      },
    };
  }

  /**
 * Validates the login credentials provided by the user.
 * If the username and password are valid, navigates the user to the
 * LoggedInScreen. Otherwise, displays an error message to the user.
 * 
 * @return A Promise that resolves to nothing.
 */
  async validateLogin() {
    const username = this.usn.current.getText();
    const password = this.pwd.current.getText();
    console.log('User:' + username + '_');
    console.log('Pwd:' + password + '_');
    const loginState = await this.getLoginController()
      .login(username, password)
      .then(loginState => {
        return loginState;
      });

    if (loginState < -1) {
      if (loginState === -2) {
        Alert.alert('Login failed', 'Username is empty. Please try again');
      }
      if (loginState === -3) {
        Alert.alert('Login failed', 'Password is empty. Please try again');
      }
      if (loginState === -4) {
        Alert.alert(
          'Login failed',
          'Username and Password is empty. Please try again',
        );
      }
    } else {
      if (loginState === -1) {
        Alert.alert('Invalid Credentials', 'Username is invalid');
      } else if (loginState === 0) {
        Alert.alert('Invalid Credentials', 'Password is incorrect');
      } else {
        // loginState === 1
        this.navigate('LoggedInScreen');
      }
    }
  }

  /**
 * Renders the loginpage
 *
 * @return {JSX.Element} - Returns a JSX element which is a component that describes what should be displayed on the screen
 */
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
            onPress={() => {
              this.validateLogin();
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
