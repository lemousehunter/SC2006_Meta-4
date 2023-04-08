import {
  FlatList,
  Keyboard,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {AppContext} from '../../../../contexts/Contexts';
import BaseScreen from '../../../BaseScreen';
import BaseLoggedInScreen from '../../BaseLoggedInScreen';
import React, {Component} from 'react';
import NButton from '../../../../components/reusable/Neuromorphic/Buttons/NButton';
import PostItem from '../../../../components/PostItem';

export default class HomeScreen extends BaseLoggedInScreen {
  constructor(props) {
    super(props);
    // console.log(this.props);
    this.createSettings();
    this.createStylesheet();
    this.state = {postList: []};
  }

  static contextType = AppContext;

  createSettings() {
    this.nSettings = {
      btn: {
        color: this.getPrimaryColor(),
        width: this.winW * 0.8,
        height: this.winH * 0.8 * 0.08,
        shadowRadius: 2,
      },
    };
  }

  async componentDidMount() {
    const postList = await this.getPostsController()
      .getAllPosts()
      .then(res => {
        console.log('mountedRes:' + JSON.stringify(res));
        return res;
      });
    this.setState({postList: postList});
  }

  createStylesheet() {
    this.styles = {
      mainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: this.getBgColor(),
        paddingBottom: this.getWinH() * 0.14,
      },
      topContainer: {
        flex: 1,
      }
    };
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
    console.log('rendered ListView');
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={this.styles.mainContainer}>
          <View style={this.styles.topContainer}>
            <Text>
              All Items
            </Text>
          </View>
          <FlatList
            contentContainerStyle={{}}
            style={{padding: 10}}
            data={this.state.postList}
            renderItem={({item}) => (
              <PostItem
                _data={item}
                edit={this.edit}
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
      </TouchableWithoutFeedback>
    );
  }
}
