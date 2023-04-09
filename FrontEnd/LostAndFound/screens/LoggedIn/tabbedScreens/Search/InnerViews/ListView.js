import React from 'react';
import {
  FlatList,
  Keyboard,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import PostItem from '../../../../../components/PostItem';
import BaseInnerView from './BaseInnerView';

export default class ListView extends BaseInnerView {
  constructor(props) {
    super(props);
    this.createStylesheet();
    console.log('test:' + JSON.stringify(this.props.test));
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
    };
  }
  getPostsStyle() {
    return {
      color: this.getBgColor(),
      winW: this.getWinW(),
      winH: this.getWinH(),
    };
  }

  edit = (postID) => {
    this.nav('CreatePost', {postID: postID});
  };

  render() {
    console.log('rendered ListView');
    console.log(JSON.stringify(this.props.route.params));
    console.log('POSTLIST:', JSON.stringify(this.props.route.params.postLst));
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={this.styles.mainContainer}>
          <FlatList
            contentContainerStyle={{}}
            style={{padding: 10}}
            data={this.props.route.params.postLst}
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
      </TouchableWithoutFeedback>
    );
  }
}
