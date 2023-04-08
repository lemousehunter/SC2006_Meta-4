import React from 'react';
import {Button, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import BaseInnerView from './Search/InnerViews/BaseInnerView';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import BaseLoggedInScreen from '../BaseLoggedInScreen';
import Carousel from 'react-native-reanimated-carousel/src/Carousel';
import ParallaxCarousel from '../../../components/imageCarousel/ParallaxCarousel';

export default class PostView extends BaseInnerView {
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
        height: this.getWinH() * 0.4,
        width: this.getWinW(),
        justifyContent: 'flex-start',
        alignItems: 'center',
      },
      bottomC: {
        backgroundColor: 'yellow',
        height: this.getWinH() * 0.4,
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
    this.nSettings = {};
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

  render() {
    console.log('in post view');
    console.log('paramsData:' + JSON.stringify(this.props.route.params));
    console.log(
      'images::' + JSON.stringify(this.props.route.params.data.images),
    );
    console.log('postViewListedBy:', this.props.route.params.data.listedBy.id);
    return (
      <View style={this.styles.bg}>
        <View style={this.styles.topC}>
          <View
            style={{
              width: '40%',
              height: '100%',
              alignItems: 'flex-start',
              paddingLeft: 20,
              justifyContent: 'center',
            }}>
            <Button
              style={{
                alignSelf: 'center',
                justifySelf: 'center',
                flex: 1,
              }}
              title={'< Back'}
              onPress={() => {
                this.props.navigation.goBack();
              }}
            />
          </View>
          <Text style={this.styles.title}> Post </Text>
        </View>
        <View style={this.styles.carouselC}>
          <ParallaxCarousel
            width={this.getWinW()}
            images={this.props.route.params.data.images}
            height={this.getWinH() * 0.4}
          />
        </View>
        <View style={this.styles.bottomC}>
          <View style={this.styles.userC}>
            <Pressable
              onPress={() => {
                console.log(
                  'navigatingTo:',
                  this.props.route.params.data.listedBy.id,
                );
                this.props.navigation.navigate('GenericAccount', {
                  user: this.props.route.params.data.listedBy.id,
                });
              }}>
              <Text style={this.styles.styledText}>
                {this.props.route.params.data.listedBy.name}
              </Text>
            </Pressable>
            <Text style={this.styles.styledText}>
              {this.formatDate(this.props.route.params.data.date)}
            </Text>
          </View>
          <View style={this.styles.bottomInnerC2}>
            <Pressable>
              <Text style={this.styles.styledText}>
                {this.props.route.params.data.location}
              </Text>
            </Pressable>
          </View>
          <View style={this.styles.bottomInnerC}>
            <Pressable>
              <Text style={this.styles.styledText}>
                {this.props.route.params.data.category}
              </Text>
            </Pressable>
          </View>
          <View style={this.styles.bottomInnerC}>
            <Text style={this.styles.styledText}>
              {this.props.route.params.data.desc}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}
