import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {Component} from 'react';
import HomeScreen from '../screens/LoggedIn/tabbedScreens/Home/HomeScreen';
import Search from '../screens/LoggedIn/tabbedScreens/Search/Search';
import CreatePost from '../screens/LoggedIn/tabbedScreens/CreatePost/CreatePost';
import Activity from '../screens/LoggedIn/tabbedScreens/Activity/Activity';
import AccountScreen from '../screens/LoggedIn/tabbedScreens/Account/Account';
import PostView from '../screens/LoggedIn/Views/PostView';

let Tab = createBottomTabNavigator();

/**
 * The NavBar component provides a navigation bar at the bottom of the screen with icons that
 * allow the user to switch between different screens. It uses createBottomTabNavigator from
 * @react-navigation/bottom-tabs to create the navigation bar and Tab.Screen to add screens
 * to it. The NavBar component takes several props, including navBarColor, activeColor,
 * normalColor, screensArray, initialParams, and user. It also defines a PlusButton component
 * to be used as a button to add new content to the app.
 */
export default class NavBar extends React.Component {
  /**
   * Constructs a new NavBar with the given props.
   *
   * @param {Object} props - The props for this component.
   * @param {string} props.navBarColor - The background color of the navigation bar.
   * @param {string} props.activeColor - The color of the icons when they are active.
   * @param {string} props.normalColor - The color of the icons when they are not active.
   * @param {Array} props.screensArray - An array of objects representing the screens to be
   *                                      added to the navigation bar.
   * @param {Object} props.initialParams - An object containing the initial params for the
   *                                        screens in the navigation bar.
   * @param {Object} props.user - The user object for the current user of the app.
   */
  constructor(props) {
    super(props);
    this.navBarColor = props.navBarColor;
    this.activeColor = props.activeColor;
    this.normalColor = props.normalColor;
    this.screensArray = props.screensArray;
    this.initialParams = props.initialParams;
    console.log('navBar initial params:' + JSON.stringify(this.initialParams));
    this.children = props.children;
    this.user = props.user;
    // console.log(this.navBarColor);
    // console.log(this.activeColor);
    // console.log(this.normalColor);
    this.styleSheet = StyleSheet.create({
      shadows: {
        shadowColor: '#7F5DF0',
        shadowOffset: {
          width: 0,
          height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
      },
      bottomNavStyle: {
        position: 'absolute',
        bottom: 25,
        left: 20,
        right: 20,
        //elevation: 0,
        backgroundColor: this.navBarColor,
        borderRadius: 15,
        height: 90,
        shadowColor: '#7F5DF0',
        shadowOffset: {
          width: 0,
          height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
      },
      tabView: {
        alignItems: 'center',
        justifyContent: 'center',
        top: 10,
      },
    });
    this.PlusButton = ({children, onPress}) => (
      <TouchableOpacity
        style={{
          top: -30,
          justifyContent: 'center',
          alignItems: 'center',
          ...this.styleSheet.shadows,
        }}
        onPress={onPress}>
        <View
          style={{
            width: 70,
            height: 70,
            borderRadius: 35,
            backgroundColor: this.activeColor,
          }}>
          {children}
        </View>
      </TouchableOpacity>
    );
  }
/**
 * Renders the navigation bar component. The method returns a `Tab.Navigator` component that
 * contains several `Tab.Screen` components for each screen in the navigation bar.
 *
 * @return A `Tab.Navigator` component containing `Tab.Screen` components for each screen in the
 *         navigation bar.
 */
  render() {
    return (
      // eslint-disable-next-line react/react-in-jsx-scope
      <Tab.Navigator
        screenOptions={{
          tabBarShowLabel: false,
          tabBarStyle: this.styleSheet.bottomNavStyle,
          headerShown: false,
        }}>
        <Tab.Screen
          name={'Home'}
          component={HomeScreen}
          options={{
            tabBarIcon: ({focused}) => (
              <View style={this.styleSheet.tabView}>
                <Image
                  source={
                    focused
                      ? require('../assets/icons/home_active.png')
                      : require('../assets/icons/home.png')
                  }
                  resizeMode={'contain'}
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: focused ? this.activeColor : this.normalColor,
                  }}
                />
                <Text
                  style={{
                    color: focused ? this.activeColor : this.normalColor,
                    fontSize: 12,
                  }}>
                  {'Home'}
                </Text>
              </View>
            ),
          }}
          initialParams={this.initialParams}
        />
        <Tab.Screen
          name={'Search'}
          component={Search}
          options={{
            tabBarIcon: ({focused}) => (
              <View style={this.styleSheet.tabView}>
                <Image
                  source={
                    focused
                      ? require('../assets/icons/search_active.png')
                      : require('../assets/icons/search.png')
                  }
                  resizeMode={'contain'}
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: focused ? this.activeColor : this.normalColor,
                  }}
                />
                <Text
                  style={{
                    color: focused ? this.activeColor : this.normalColor,
                    fontSize: 12,
                  }}>
                  {'Search'}
                </Text>
              </View>
            ),
          }}
          initialParams={this.initialParams}
        />
        <Tab.Screen
          name={'CreatePost'}
          component={CreatePost}
          options={{
            tabBarIcon: ({focused}) => {
              return (
                <Image
                  source={require('../assets/icons/post.png')}
                  resizeMode={'contain'}
                  style={{
                    width: 30,
                    height: 30,
                    tintColor: this.navBarColor,
                  }}
                />
              );
            },
            tabBarButton: props => <this.PlusButton {...props} />,
          }}
          initialParams={this.initialParams}
        />
        <Tab.Screen
          name={'Activity'}
          component={Activity}
          options={{
            tabBarIcon: ({focused}) => (
              <View style={this.styleSheet.tabView}>
                <Image
                  source={
                    focused
                      ? require('../assets/icons/notification_active.png')
                      : require('../assets/icons/notification.png')
                  }
                  resizeMode={'contain'}
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: focused ? this.activeColor : this.normalColor,
                  }}
                />
                <Text
                  style={{
                    color: focused ? this.activeColor : this.normalColor,
                    fontSize: 12,
                  }}>
                  {'Activity'}
                </Text>
              </View>
            ),
          }}
          initialParams={this.initialParams}
        />
        <Tab.Screen
          name={'Account'}
          component={AccountScreen}
          options={{
            tabBarIcon: ({focused}) => (
              <View style={this.styleSheet.tabView}>
                <Image
                  source={
                    focused
                      ? require('../assets/icons/account_active.png')
                      : require('../assets/icons/account.png')
                  }
                  resizeMode={'contain'}
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: focused ? this.activeColor : this.normalColor,
                  }}
                />
                <Text
                  style={{
                    color: focused ? this.activeColor : this.normalColor,
                    fontSize: 12,
                  }}>
                  {'Account'}
                </Text>
              </View>
            ),
          }}
          initialParams={this.initialParams}
        />
      </Tab.Navigator>
    );
  }
}
