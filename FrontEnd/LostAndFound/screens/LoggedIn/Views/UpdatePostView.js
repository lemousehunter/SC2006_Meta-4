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

/**
Represents the UpdatePostView class, which is a React component used for updating posts.
Inherits from the BaseInnerView class.
*/
export default class UpdatePostView extends BaseInnerView {

  /**
Constructs a new UpdatePostView object with the given props.
Initializes the component's stylesheet and neuromorphic settings.
@param {Object} props - The props passed down to the component.
*/
  constructor(props) {
    super(props);
    this.createStyleSheet();
    this.getNSettings();
    console.log('props', JSON.stringify(this.props));
  }

  /**
Creates the component's stylesheet using the getBgColor, getWinH, and getWinW methods.
*/
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

  /**
Initializes the component's neuromorphic settings using the getBgColor, getPrimaryColor, getWinW, and getWinH methods.
*/
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

  /**
Formats a date object into a string in the format "dd/mm/yyyy".
@param {Date} date - The date object to format.
@returns {string} A string representing the formatted date.
*/
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

  /**
   * Renders the Nbutton component which allows the user to submit a request for a lost or found item,
   * depending on whether the item is marked as lost or found
   *
   * @return an NButton component with the label "I lost it" or "I found it"depending on the value of isLost. 
   * If the current user is the same as the user who listed the item, the function does not return anything
   */
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
