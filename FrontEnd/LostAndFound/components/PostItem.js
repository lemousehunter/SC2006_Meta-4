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
      lineContainer: {
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
      menuIcon: {
        width: this.winW * 0.035,
        height: this.winH * 0.02,
      },
      locIcon: {
        width: this.winW * 0.035,
        height: this.winH * 0.02,
      },
      acctIcon: {
        width: this.winW * 0.035,
        height: this.winH * 0.016,
      },
      catIcon: {
        width: this.winW * 0.035,
        height: this.winH * 0.016,
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

  renderMenu() {
    console.log('currentUser!!:', JSON.stringify(this.props.currentUser));
    console.log('listedBy:', JSON.stringify(this.props._data.listedBy.id));
    if (this.props._data.listedBy.id === this.props.currentUser) {
      console.log('same');
      return this.renderOwnMenu();
    } else {
      return this.renderOthersMenu();
    }
  }

  renderOthersMenu() {
    console.log('rendering others menu');
    return (
      <Menu renderer={renderers.ContextMenu}>
        <MenuTrigger>
          <Image
            style={this.styles.menuIcon}
            source={require('../assets/icons/menu.png')}
          />
        </MenuTrigger>
        <MenuOptions
          customStyles={{
            optionsContainer: this.styles.options,
            optionText: this.styles.text,
          }}>
          <MenuOption onSelect={() => alert('Report')}>
            <Text style={{color: 'red', fontFamily: 'Nunito-Light'}}>
              Report
            </Text>
          </MenuOption>
        </MenuOptions>
      </Menu>
    );
  }

  renderOwnMenu() {
    return (
      <Menu renderer={renderers.ContextMenu}>
        <MenuTrigger>
          <Image
            style={this.styles.menuIcon}
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
              this.props.edit(this.props._data.postID);
            }}
            text="Edit"
          />
          <MenuOption
            onSelect={async () => {
              await this.props.postC.deletePost(this.postID).then(res => {
                console.log('DelRes:' + JSON.stringify(res));
                this.props.fn();
              });
            }}>
            <Text style={{color: 'red', fontFamily: 'Nunito-Light'}}>
              Delete
            </Text>
          </MenuOption>
        </MenuOptions>
      </Menu>
    );
  }

  render() {
    return (
      <Pressable
        onPress={async () => {
          const post = await this.props.postC
            .getPostByID(this.postID)
            .then(res => {
              console.log('PostItemRes:' + JSON.stringify(res));
              return res;
            });
          const data = {
            images: post.images,
            date: post.date,
            categoryID: post.category.id,
            category: post.category.name,
            location: post.location,
            isResolved: post.isResolved,
            listedBy: post.listedBy,
            desc: post.itemDescription,
          };
          console.log('dataImages:' + JSON.stringify(data.images));
          this.props.nav.navigate('PostView', {data: data});
        }}>
        <NCard settings={this.nSettings.mainCard}>
          <View style={this.styles.mainContainer}>
            <View style={this.styles.leftContainer}>
              <Image
                style={this.styles.img}
                source={{
                  uri: this.props._data.image,
                }}
              />
            </View>
            <View style={this.styles.rightContainer}>
              <View style={this.styles.titleContainer}>
                <Text style={this.styles.titleText}>
                  {this.props._data.type} {this.props._data.item}
                </Text>
                <Text style={this.styles.timingText}>
                  {this.props._data.timing}
                </Text>
                <View style={{width: this.winW * 0.02}} />
                {this.renderMenu()}
              </View>
              <View style={this.styles.lineContainer}>
                <Image
                  style={this.styles.acctIcon}
                  source={require('../assets/icons/account.png')}
                />
                <View style={this.styles.separator} />
                <Text style={this.styles.text}>
                  {this.props._data.listedBy.name}
                </Text>
              </View>
              <View style={this.styles.lineContainer}>
                <Image
                  style={this.styles.locIcon}
                  source={require('../assets/icons/pin.png')}
                />
                <View style={this.styles.separator} />
                <Text style={this.styles.text}>
                  {this.props._data.location}
                </Text>
              </View>
              <View style={this.styles.lineContainer}>
                <Image
                  style={this.styles.catIcon}
                  source={require('../assets/icons/category.png')}
                />
                <View style={this.styles.separator} />
                <Text style={this.styles.text}>
                  {this.props._data.category}
                </Text>
              </View>
            </View>
          </View>
        </NCard>
      </Pressable>
    );
  }
}
