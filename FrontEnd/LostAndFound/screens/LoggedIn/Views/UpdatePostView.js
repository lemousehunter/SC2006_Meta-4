import React from 'react';
import {Button, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import BaseInnerView from '../tabbedScreens/Search/InnerViews/BaseInnerView';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import BaseLoggedInScreen from '../BaseLoggedInScreen';
import Carousel from 'react-native-reanimated-carousel/src/Carousel';
import ParallaxCarousel from '../../../components/imageCarousel/ParallaxCarousel';
import NonTabbedScreenContainer from '../NonTabbedScreenContainer';
import NCard from '../../../components/reusable/Neuromorphic/Cards/NCard';
import NButton from '../../../components/reusable/Neuromorphic/Buttons/NButton';
import CreatePost from '../tabbedScreens/CreatePost/CreatePost';

export default class UpdatePostView extends BaseInnerView {
  constructor(props) {
    super(props);
    this.createStyleSheet();
    this.getNSettings();
    console.log('props', JSON.stringify(this.props));
  }
  createStyleSheet() {
    this.styles = StyleSheet.create({
      bg: {
        flex: 1,
        backgroundColor: this.getBgColor(),
        justifyContent: 'center',
        alignItems: 'center',
      },
      topC: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: this.getWinH() * 0.1,
        width: this.getWinW(),
      },
      carouselC: {
        //backgroundColor: 'red',
        height: this.getWinH() * 0.4,
        width: this.getWinW(),
        justifyContent: 'flex-start',
        alignItems: 'center',
      },
      bottomC: {
        //backgroundColor: 'yellow',
        height: this.getWinH() * 0.5,
        width: this.getWinW(),
      },
      title: {
        textAlign: 'center',
        fontFamily: 'Quicksand',
        fontWeight: 'bold',
        fontSize: 30,
      },
      userC: {
        paddingTop: 20,
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexDirection: 'row',
      },
      bottomInnerC2: {
        paddingTop: 70,
        paddingLeft: 20,
        justifyContent: 'center',
        alignItems: 'flex-start',
      },
      bottomInnerC: {
        paddingTop: 20,
        paddingLeft: 20,
        justifyContent: 'center',
        alignItems: 'flex-start',
      },
      styledTextBold: {
        textAlign: 'left',
        fontFamily: 'Quicksand',
        fontWeight: '100',
        fontSize: 20,
      },
      styledText: {
        textAlign: 'left',
        fontFamily: 'Nunito-Light',
        fontWeight: '100',
        fontSize: 20,
      },
    });
  }

  getNSettings() {
    this.nSettings = {
      contentCard: {
        color: this.getBgColor(),
        width: this.getWinW(),
        height: this.getWinH() * 0.5,
        blur: false,
        shadowRadius: 4,
      },
      btn: {
        color: this.getPrimaryColor(),
        width: this.getWinW() * 0.9,
        height: this.getWinH() * 0.05,
        blur: false,
        shadowRadius: 2,
      },
    };
  }

  formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    let year = d.getFullYear();
    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
    return [day, month, year].join('/');
  }

  renderButton(isLost) {
    if (
      this.props.route.params.data.currentUser !==
      this.props.route.params.data.listedBy.id
    ) {
      return (
        <NButton
          textColor={this.getSecondaryColor()}
          settings={this.nSettings.btn}
          label={'I ' + isLost + ' it'}
        />
      );
    }
  }

  render() {
    console.log('in update view');
    console.log('paramsData:' + JSON.stringify(this.props.route.params));
    console.log(
      'images::' + JSON.stringify(this.props.route.params.data.images),
    );
    console.log('postViewListedBy:', this.props.route.params.data.listedBy.id);
    const isLost = this.props.route.params.data.isLost ? 'found' : 'lost';
    return (
      <NonTabbedScreenContainer
        route={{params: this.getParams()}}
        navigation={this.props.navigation}
        fullWidth={true}
        title={'Edit Post'}>
        <CreatePost
          route={{
            params: {
              ...this.getParams(),
              postID: this.props.route.params.data.postID,
            },
          }}
          navigation={this.props.navigation}
        />
      </NonTabbedScreenContainer>
    );
  }
}
