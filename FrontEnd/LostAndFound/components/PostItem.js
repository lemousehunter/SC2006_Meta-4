import React from 'react';
import NCard from '../components/reusable/Neuromorphic/Cards/NCard';
import {Image, PixelRatio, Pressable, Text, View} from 'react-native';
import NButton from '../components/reusable/Neuromorphic/Buttons/NButton';
import {StyleSheet} from 'react-native';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers,
} from 'react-native-popup-menu';
import CustomRenderer from './reusable/Neuromorphic/Dropdown/CustomRenderer';

export default class PostItem extends React.Component {
  constructor(props) {
    super(props);
    console.log('PostItem_data:' + JSON.stringify(this.props._data));
    this.color = this.props.postStyle.color;
    this.winW = this.props.postStyle.winW;
    this.winH = this.props.postStyle.winH;
    this.name = this.props._data.name;
    this.item = this.props._data.item;
    this.type = this.props._data.type;
    this.loc = this.props._data.location;
    this.edit = this.props.edit;
    this.timing = this.props._data.timing;
    this.postID = this.props._data.postID;
    this.image = this.props._data.image;
    this.category = this.props._data.category;
    this.coordinates = this.props._data.coordinates;
    this.getStyleSheet();
    this.getNSettings();
    console.log('imageURI:' + this.image);
  }

  getStyleSheet() {
    this.styles = StyleSheet.create({
      mainContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
      },
      leftContainer: {
        flex: 1,
      },
      rightContainer: {
        flex: 2,
        paddingLeft: this.winW * 0.05,
        paddingRight: this.winW * 0.03,
        paddingVertical: this.winW * 0.05,
      },
      titleContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      },
      locationContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
      },
      categoryContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
      },
      titleText: {
        flex: 6,
        fontFamily: 'Quicksand',
        fontSize: 15,
        fontWeight: 'bold',
        justifyContent: 'flex-start',
      },
      timingText: {
        flex: 2,
        textAlign: 'right',
        fontFamily: 'SF Pro Display',
        fontSize: 15,
        fontWeight: '100',
      },
      text: {
        fontFamily: 'nunito-light',
      },
      img: {
        width: this.winW * 0.3,
        height: this.winH * 0.15,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        flex: 1,
      },
      locIcon: {
        width: this.winW * 0.035,
        height: this.winH * 0.02,
      },
      separator: {
        width: this.winW * 0.02,
        height: this.winH * 0.02,
      },
      menu: {
        width: 20,
        height: 20,
      },

      options: {
        position: 'absolute',
        borderRadius: 10,
        backgroundColor: 'white',
        width: PixelRatio.roundToNearestPixel(55),

        // Shadow only works on iOS.
        shadowColor: 'black',
        shadowOpacity: 0.3,
        shadowOffset: {width: 3, height: 3},
        shadowRadius: 4,

        // This will elevate the view on Android, causing shadow to be drawn.
        elevation: 5,
      },
    });
  }

  getNSettings() {
    this.nSettings = {
      mainCard: {
        color: this.color,
        width: this.winW * 0.9,
        height: this.winH * 0.15,
        flexDirection: 'column',
        shadowRadius: 4,
        blur: false,
      },
    };
  }

  render() {
    return (
      <Pressable
        onPress={() => {
          console.log('pressed post' + this.postID);
        }}>
        <NCard settings={this.nSettings.mainCard}>
          <View style={this.styles.mainContainer}>
            <View style={this.styles.leftContainer}>
              <Image
                style={this.styles.img}
                source={{
                  uri: this.image,
                }}
              />
            </View>
            <View style={this.styles.rightContainer}>
              <View style={this.styles.titleContainer}>
                <Text style={this.styles.titleText}>
                  {this.type} {this.item}
                </Text>
                <Text style={this.styles.timingText}>{this.timing}</Text>
                <View style={{width: this.winW * 0.02}} />
                <Menu renderer={renderers.ContextMenu}>
                  <MenuTrigger>
                    <Image
                      style={this.styles.locIcon}
                      source={require('../assets/icons/menu.png')}
                    />
                  </MenuTrigger>
                  <MenuOptions
                    customStyles={{
                      optionsContainer: this.styles.options,
                      optionText: this.styles.text,
                    }}>
                    <MenuOption
                      onSelect={() => {
                        this.props.edit(this.postID);
                      }}
                      text="Edit"
                    />
                    <MenuOption onSelect={() => alert('Delete')}>
                      <Text style={{color: 'red', fontFamily: 'Nunito-Light'}}>
                        Delete
                      </Text>
                    </MenuOption>
                  </MenuOptions>
                </Menu>
              </View>
              <View style={this.styles.locationContainer}>
                <Image
                  style={this.styles.locIcon}
                  source={require('../assets/icons/pin.png')}
                />
                <View style={this.styles.separator} />
                <Text style={this.styles.text}>{this.loc}</Text>
              </View>
              <View style={this.styles.categoryContainer}>
                <Pressable
                  onPress={() => {
                    console.log('pressed category');
                  }}>
                  <Text style={this.styles.text}>{this.category}</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </NCard>
      </Pressable>
    );
  }
}
