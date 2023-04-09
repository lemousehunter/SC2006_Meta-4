import {Button, FlatList, Text, View} from 'react-native';
import {StyleSheet} from 'react-native';
import React from 'react';
import ProfileCard from './ProfileCard';
import PostItem from '../../../../components/PostItem';
import BaseLoggedInScreen from '../../BaseLoggedInScreen';
import {AppContext} from '../../../../contexts/Contexts';
import Geolocation from '@react-native-community/geolocation';
import NCard from '../../../../components/reusable/Neuromorphic/Cards/NCard';
import {Dropdown} from 'react-native-element-dropdown';

export default class AccountScreen extends BaseLoggedInScreen {
  constructor(props) {
    super(props);
    this.state = {
      postData: [],
      name: '',
      email: '',
      socialRep: '',
      numPosts: '',
      rerender: '',
    };
    this.createStylesheet();
    this.getSettings();
    this.state = {
      postStatuses: [
        {label: 'All', value: 0},
        {label: 'Unresolved', value: 1},
        {label: 'Resolved', value: 2},
      ],
      postStatus: 0,
    };
  }

  static contextType = AppContext;

  getSettings() {
    this.nSettings = {
      dropdownCard: {
        color: this.getBgColor(),
        width: this.getWinW() * 0.8,
        height: this.getWinH() * 0.8 * 0.05,
      },
    };
  }

  createStylesheet() {
    this.styles = StyleSheet.create({
      mainContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: this.getBgColor(),
        flex: 1,
      },
      profileContainer: {
        flex: 2,
        justifyContent: 'flex-end',
        alignItems: 'center',
      },
      dropdownC: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
        shadowRadius: 2,
      },
      bottomContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 2,
        paddingTop: this.winW * 0.05,
        paddingBottom: 120,
      },
      dropdown: {
        height: '100%',
        width: '100%',
        borderRadius: 22,
        paddingHorizontal: 8,
      },
      dropdownListContainer: {
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
      },
      styledText2: {
        flex: 1,
        textAlign: 'left',
        fontFamily: 'Nunito-Light',
        fontSize: 15,
      },
    });
  }

  onFocus = async () => {
    //console.log('accountProps:' this.props)
    //console.log('accountUser:', this.props.user);
    console.log('focused on accounts page');
    await this.getLoginController()
      .getUserByID(
        !this.props.route.params.user
          ? this.getUser()
          : this.props.route.params.user,
      )
      .then(user => {
        console.log('getUserByID:' + JSON.stringify(user));
        this.setState({
          name: user.name,
          email: user.email,
          socialRep: user.creditScore,
          numPosts: user.posts.length,
        });
      });
    await this.getPostsController()
      .getPostItemsByUserID(
        !this.props.route.params.user
          ? this.getUser()
          : this.props.route.params.user,
        this.state.postStatus,
      )
      .then(res => {
        this.setState({postData: res});
      });
    console.log('setPostsData');
    console.log('setPostsData:' + JSON.stringify(this.state.postData));
  };

  async componentDidMount() {
    console.log('component did mount');
    this.focusSub = this.props.navigation.addListener('focus', () => {
      this.onFocus();
    });
    await this.onFocus();
  }

  getPostsStyle() {
    return {
      color: this.getBgColor(),
      winW: this.getWinW(),
      winH: this.getWinH(),
    };
  }

  // edit = postID => {
  //   console.log('postID____:', postID);
  //   this.nav('UpdatePost', {postID: postID});
  // };

  render() {
    // console.log('width' + this.getWinW());
    // console.log('height' + this.getWinH());
    // console.log('bgColor' + this.getBgColor());
    // console.log('props:' + JSON.stringify(this.props));
    // console.log(
    //   'accountLoginController:' + JSON.stringify(this.getLoginController()),
    // );
    // console.log('postController_' + JSON.stringify(this.getPostsController()));
    // console.log('accountUser:' + this.getUser());
    //this.getPostsController().getPostByID('123').then(res => console.log('res_' + res));
    //console.log('data: ' + JSON.stringify(this.getData()));
    return (
      <View style={this.styles.mainContainer}>
        {/*{<Button style={{flex: 1}} title={'< Back'}/>}*/}
        <View style={this.styles.profileContainer}>
          <ProfileCard
            color={this.getBgColor()}
            primaryColor={this.getPrimaryColor()}
            secondaryColor={this.getSecondaryColor()}
            callColor={this.getCallColor()}
            btnFont={this.getButtonFont()}
            winW={this.getWinW()}
            winH={this.getWinH()}
            _name={this.state.name}
            username={this.state.email}
            userSince={'2000'}
            socialRep={this.state.socialRep}
            numPosts={this.state.numPosts}
            logout={() => {
              this.navigate('PreLoginHomepage');
              console.log('logging out');
            }}
            currentUser={this.getUser()}
            user={
              !this.props.route.params.user ? this.getUser() : this.props.user
            }
            contact={() => console.log('contact meeeee')}
          />
        </View>
        <View style={this.styles.dropdownC}>
          <NCard settings={this.nSettings.dropdownCard}>
            <Dropdown
              itemContainerStyle={this.styles.dropdownListContainer}
              containerStyle={this.styles.dropdownListContainer}
              style={this.styles.dropdown}
              data={this.state.postStatuses}
              itemTextStyle={this.styles.styledText2}
              selectedTextStyle={this.styles.styledText2}
              placeholderStyle={this.styles.styledText2}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Post Status"
              value={this.state.postStatus}
              onChange={async item => {
                this.setState({postStatus: item.value});
                console.log('navigating to:' + item.value);
                await this.onFocus().then(res => {
                  return res;
                });
              }}
            />
          </NCard>
        </View>
        <View style={this.styles.bottomContainer}>
          <FlatList
            data={this.state.postData}
            renderItem={({item}) => (
              <PostItem
                fn={this.onFocus}
                _data={item}
                //edit={this.edit}
                currentUser={this.getUser()}
                postStyle={this.getPostsStyle()}
                nav={this.getNav()}
                loginC={this.getLoginController()}
                postC={this.getPostsController()}
              />
            )}
            ItemSeparatorComponent={() => <View style={{height: 20}} />}
          />
        </View>
      </View>
    );
  }
}
