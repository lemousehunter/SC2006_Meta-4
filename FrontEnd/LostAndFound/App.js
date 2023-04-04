import LoginPage from './screens/LoginRegister/Login';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import RegisterPage from './screens/LoginRegister/Register';
import {Dimensions, Keyboard, TouchableWithoutFeedback} from 'react-native';
import LoggedInScreen from './screens/LoggedIn/LoggedInScreen';
import LoginController from './controllers/local/LoginController';
import React from 'react';
import {ParamContext, ControllerContext} from './contexts/Contexts';
import ProvideCombinedContext from './contexts/AppContext';
import {MenuProvider} from 'react-native-popup-menu';
import PostsController from './controllers/local/PostsController';
import CategoriesController from './controllers/local/CategoriesController';
import DataController from './controllers/remote/DataController';

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
  const ParamsContext = ParamContext;
  const ControllersContext = ControllerContext;
  const url = 'http://localhost:3000/';
  const dataController = new DataController(url);
  const postController = new PostsController(dataController);
  const loginController = new LoginController(dataController);
  const categoriesController = new CategoriesController(dataController);
  const controllers = {
    nav: nav,
    postsController: postController,
    loginController: loginController,
    categoriesController: categoriesController,
  };

  const params = {
    bgColor: bgColor,
    winW: winW,
    winH: winH,
    primaryColor: primaryColor,
    secondaryColor: secondaryColor,
    callColor: callColor,
    buttonFont: buttonFont,
  };
  const landingScreen = controllers.loginController.getLoggedIn()
    ? 'LoggedInScreen'
    : 'PreLoginHomepage';
  const screenDetails = [
    {name: 'PreLoginHomepage', component: LoginPage},
    {name: 'RegisterPage', component: RegisterPage},
    {name: 'LoggedInScreen', component: LoggedInScreen},
  ];
  // const Screens = screenDetails.map(s => {
  //   return (
  //     <Stack.Screen
  //       name={s.name}
  //       component={s.component}
  //       initialParams={params}
  //     />
  //   );
  // });
  return (
    <MenuProvider>
      <ControllersContext.Provider value={controllers}>
        <ParamsContext.Provider value={params}>
          <ProvideCombinedContext>
            <NavigationContainer ref={nav}>
              <Stack.Navigator
                initialRouteName={landingScreen}
                screenOptions={{
                  headerShown: false,
                }}>
                <Stack.Screen
                  name={screenDetails[0].name}
                  component={screenDetails[0].component}
                  initialParams={params}
                />
                <Stack.Screen
                  name={screenDetails[1].name}
                  component={screenDetails[1].component}
                  initialParams={params}
                />
                <Stack.Screen
                  name={screenDetails[2].name}
                  component={screenDetails[2].component}
                  initialParams={params}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </ProvideCombinedContext>
        </ParamsContext.Provider>
      </ControllersContext.Provider>
    </MenuProvider>
  );
}
