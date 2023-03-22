import PreLoginHomepage from './screens/LoginRegister/PreLoginHomepage';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginPage from './screens/LoginRegister/Login';
import RegisterPage from './screens/LoginRegister/Register';
import {Dimensions} from 'react-native';
import HomeScreen from './screens/LoggedIn/tabbedScreens/Home/HomeScreen';
import LoggedInScreen from './screens/LoggedIn/LoggedInScreen';

const Stack = createNativeStackNavigator();
const winH = Dimensions.get('window').height;
const winW = Dimensions.get('window').width;
const bgColor = '#FFF8EB';
const primaryColor = '#7A9E9F';
const secondaryColor = '#e8f4ea';
const callColor = '#ff7477';
const buttonFont = 'Nunito-Light';

export default function App() {
  return (
    // eslint-disable-next-line react/react-in-jsx-scope
    <NavigationContainer>
      {/* eslint-disable-next-line react/react-in-jsx-scope */}
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        {/* eslint-disable-next-line react/react-in-jsx-scope */}
        <Stack.Screen
          name="PreLoginHomepage"
          component={PreLoginHomepage}
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
          name="LoginPage"
          component={LoginPage}
          initialParams={{
            bgColor: bgColor,
            winW: winW,
            winH: winH,
            primaryColor: primaryColor,
            secondaryColor: secondaryColor,
            callColor: callColor,
            buttonFont: buttonFont
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
  );
}
