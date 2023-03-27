import Login from './screens/LoginRegister/Login';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginPage from './screens/LoginRegister/Login';
import RegisterPage from './screens/LoginRegister/Register';
import {Dimensions, Keyboard, TouchableWithoutFeedback} from 'react-native';
import HomeScreen from './screens/LoggedIn/tabbedScreens/Home/HomeScreen';
import LoggedInScreen from './screens/LoggedIn/LoggedInScreen';
import LoginController from './controllers/LoginController';
import React from 'react';
import {AppContext} from './components/Context';

const Stack = createNativeStackNavigator();
const winH = Dimensions.get('window').height;
const winW = Dimensions.get('window').width;
const bgColor = '#FFF8EB';
const primaryColor = '#7A9E9F';
const secondaryColor = '#e8f4ea';
const callColor = '#ff7477';
const buttonFont = 'Nunito-Light';

export default function App() {
  const nav = React.useRef(null);
  const Context = AppContext;
  const controllers = {
    nav: nav,
    loginController: new LoginController(),
  };
  return (
    <Context.Provider value={controllers}>
      <NavigationContainer ref={nav}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen
            name="PreLoginHomepage"
            component={Login}
            initialParams={{
              bgColor: bgColor,
              winW: winW,
              winH: winH,
              primaryColor: primaryColor,
              secondaryColor: secondaryColor,
              callColor: callColor,
              buttonFont: buttonFont,
            }}
          />
          <Stack.Screen
            name="RegisterPage"
            component={RegisterPage}
            initialParams={{
              bgColor: bgColor,
              winW: winW,
              winH: winH,
              primaryColor: primaryColor,
              secondaryColor: secondaryColor,
              callColor: callColor,
              buttonFont: buttonFont,
            }}
          />
          <Stack.Screen
            name="LoggedInScreen"
            component={LoggedInScreen}
            initialParams={{
              bgColor: bgColor,
              winW: winW,
              winH: winH,
              primaryColor: primaryColor,
              secondaryColor: secondaryColor,
              callColor: callColor,
              buttonFont: buttonFont,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Context.Provider>
  );
}
