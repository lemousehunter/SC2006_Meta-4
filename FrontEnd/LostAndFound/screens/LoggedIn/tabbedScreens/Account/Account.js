import {FlatList, Text, View} from 'react-native';
import {StyleSheet} from 'react-native';
import React from 'react';
import ProfileCard from './ProfileCard';
import PostItem from '../../../../components/PostItem';
import BaseLoggedInScreen from '../../BaseLoggedInScreen';

export default class AccountScreen extends BaseLoggedInScreen {
  constructor(props) {
    super(props);
    this.state = {
      postData: [],
      name: '',
      email: '',
      socialRep: '',
      numPosts: '',
    };
    this.createStylesheet();
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
      bottomContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 2,
        paddingTop: this.winW * 0.05,
        paddingBottom: 120,
      },
    });
  }

  async componentDidMount() {
    await this.getLoginController()
      .getUserByID(this.getUser())
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
      .getPostItemsByUser(this.getUser())
      .then(res => {
        this.setState({postData: res});
      });
    console.log('setUserState');
    console.log('name:' + this.state.name);
  }

  getPostsStyle() {
    return {
      color: this.getBgColor(),
      winW: this.getWinW(),
      winH: this.getWinH(),
    };
  }

  edit = postID => {
    this.nav('CreatePost', {postID: postID});
  };

  render() {
    console.log('width' + this.getWinW());
    console.log('height' + this.getWinH());
    console.log('bgColor' + this.getBgColor());
    console.log('props:' + JSON.stringify(this.props));
    console.log(
      'accountLoginController:' + JSON.stringify(this.getLoginController()),
    );
    console.log('accountUser:' + this.getUser());
    //console.log('data: ' + JSON.stringify(this.getData()));
    return (
      <View style={this.styles.mainContainer}>
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
            user={this.getUser()}
            contact={() => console.log('contact meeeee')}
          />
        </View>
        <View style={this.styles.bottomContainer}>
          <FlatList
            contentContainerStyle={{}}
            style={{padding: 10}}
            data={this.state.postData}
            renderItem={({item}) => (
              <PostItem
                _data={item}
                edit={this.edit}
                postStyle={this.getPostsStyle()}
              />
            )}
            ItemSeparatorComponent={() => <View style={{height: 20}} />}
          />
        </View>
      </View>
    );
  }
}
