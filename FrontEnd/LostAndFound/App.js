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
import PostView from './screens/LoggedIn/Views/PostView';
import 'react-native-gesture-handler';
import Account from './screens/LoggedIn/tabbedScreens/Account/Account';
import GenericAccountView from './screens/LoggedIn/Views/GenericAccountView';
import ReportsController from './controllers/local/ReportsController';
import ReportsView from './screens/LoggedIn/ReportsView';
import UpdatePostView from './screens/LoggedIn/Views/UpdatePostView';
import RequestsController from './controllers/local/requestsController';

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
  const loginController = new LoginController(dataController);
  const postController = new PostsController(dataController, loginController);
  const reportsController = new ReportsController(
    dataController,
    postController,
  );
  const categoriesController = new CategoriesController(dataController);
  const requestsController = new RequestsController(
    dataController,
    postController,
    loginController,
  );
  const controllers = {
    nav: nav,
    postsController: postController,
    loginController: loginController,
    categoriesController: categoriesController,
    reportsController: reportsController,
    requestsController: requestsController,
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
    {name: 'PostView', component: PostView},
    {name: 'GenericAccountView', component: GenericAccountView},
    {name: 'ReportsView', component: ReportsView},
    {name: 'UpdatePostView', component: UpdatePostView},
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
                <Stack.Screen
                  name={screenDetails[3].name}
                  component={screenDetails[3].component}
                  initialParams={params}
                />
                <Stack.Screen
                  name={screenDetails[4].name}
                  component={screenDetails[4].component}
                  initialParams={params}
                />
                <Stack.Screen
                  name={screenDetails[5].name}
                  component={screenDetails[5].component}
                  initialParams={params}
                />
                <Stack.Screen
                  name={screenDetails[6].name}
                  component={screenDetails[6].component}
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
