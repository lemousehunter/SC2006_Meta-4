import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {Component} from 'react';
import HomeScreen from '../screens/LoggedIn/tabbedScreens/Home/HomeScreen';
import Search from '../screens/LoggedIn/tabbedScreens/Search/Search';
import CreatePost from '../screens/LoggedIn/tabbedScreens/CreatePost/CreatePost';
import ChatScreen from '../screens/LoggedIn/tabbedScreens/Chat/Chat';
import AccountScreen from '../screens/LoggedIn/tabbedScreens/Account/Account';

let Tab = createBottomTabNavigator();

function HS() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Home!</Text>
    </View>
  );
}

export default class NavBar extends React.Component {
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
          name={'Chat'}
          component={ChatScreen}
          options={{
            tabBarIcon: ({focused}) => (
              <View style={this.styleSheet.tabView}>
                <Image
                  source={
                    focused
                      ? require('../assets/icons/chat_active.png')
                      : require('../assets/icons/chat.png')
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
                  {'Chat'}
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
