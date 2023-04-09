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
/**
 * The PostItem component is used to display a post item and allows the user to interact with it.
 * It includes a Pressable component that, when pressed, navigates the user to a view where they can see more details about the post
 * It contains several nested View components, each of which contains a Text component with information about the post, 
 * as well as several custom icons that are used to indicate the post's location, category, and listed-by user
 */
export default class PostItem extends React.Component {
  /**
   * Constructor for PostItem.
   * @param {Object} props - The props object passed to the component.
   * @param {Object} props._data - The data object used to render the post.
   * @param {string} props._data.name - The name for the PostItem component.
   * @param {string} props._data.item - The item for the PostItem component
   * @param {string} props._data.type - The item type for the PostItem component
   * @param {string} props._data.location - The location for the PostItem component
   * @param {string} props._data.timing - The timing for the PostItem component.
   * @param {string} props._data.postID - The post ID for the PostItem component
   * @param {string} props._data.image - The image for the PostItem component.
   * @param {string} props._data.category - The category for the PostItem component.
   * @param {Array} props._data.coordinates - The coordinates for the PostItem component
   * @param {Object} props.postStyle - The styling object used to render the post.
   * @param {string} props.postStyle.color - The color of the post.
   * @param {number} props.postStyle.winW - The width of the window.
   * @param {number} props.postStyle.winH - The height of the window.
   */
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
  /**
   *Retrieves the style sheet object for this component and sets it to the
  "styles" property of this instance. The style sheet contains styles for
  various components in this PostItem, including the main container, left
  container, right container, title container, line container, category
  container, title text, timing text, text, image, menu icon, location icon,
  account icon, category icon, separator, and menu.
*/
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
  /**
  Initializes the nSettings object with the main card style properties.
  @return void
  */
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
  /**
 * A function that handles editing the current post item.
 * It navigates to the 'UpdatePostView' and passes the post data to it.
 *
 * @return {void}
 */
  edit = () => {
    console.log('postID____:', this.props._data.postID);
    this.props.nav.navigate('UpdatePostView', {
      data: {
        ...this.props._data,
        postID: this.props._data.postID,
      },
    });
  };
  /**
 * Renders the menu for the PostItem component. If the current user is the owner of the post,
 * the method renders an edit and delete menu, otherwise it renders a report menu. The menu
 * is implemented using the react-native-popup-menu package.
 *
 * @return The rendered menu.
 */
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
  /**
 * This function is responsible for rendering the menu options that are visible to users other than the one who posted the item. 
 * It checks whether the user currently logged in is the same as the one who posted the item, and renders the appropriate menu options accordingly.
 * @returns {JSX.Element} - Returns a JSX element that contains the menu options visible to users other than the one who posted the item.
 */
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
          <MenuOption
            onSelect={() =>
              this.props.nav.navigate('ReportsView', {
                postID: this.postID,
                currentUser: this.props.currentUser,
              })
            }>
            <Text style={{color: 'red', fontFamily: 'Nunito-Light'}}>
              Report
            </Text>
          </MenuOption>
        </MenuOptions>
      </Menu>
    );
  }
  /**
 * This function is responsible for rendering the menu options for the user who owns the post. 
 * It checks whether the user currently logged in is the same as the one who posted the item, and renders the appropriate menu options accordingly.
 * @returns {JSX.Element} - Returns a JSX element that contains the menu options for the user who owns the post.
 */
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
              console.log('this.props._data.postID:', this.props._data.postID);
              this.edit(this.props._data.postID);
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
  /**
   * Renders the component, view composed of various React Native components, such as NCard, Image, Text, Pressable, and Menu.
   *Includes event handlers for various user interactions, such as clicking on a button or selecting an option from a menu
   * @returns {JSX.Element} - Returns a JSX element that defines the layout and content of the component's view
   */
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
            title: post.itemName,
            images: post.images,
            date: post.date,
            categoryID: post.category.id,
            category: post.category.name,
            location: post.location,
            isResolved: post.isResolved,
            listedBy: post.listedBy,
            desc: post.itemDescription,
            isLost: post.isLost,
            currentUser: this.props.currentUser,
            postID: this.postID,
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
