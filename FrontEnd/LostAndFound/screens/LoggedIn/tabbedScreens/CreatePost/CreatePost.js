import {
  Keyboard,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import BaseLoggedInScreen from '../../BaseLoggedInScreen';
import NCard from '../../../../components/reusable/Neuromorphic/Cards/NCard';
import NTextInput from '../../../../components/reusable/Neuromorphic/TextInput/NTextInput';
import React from 'react';
import {Dropdown} from 'react-native-element-dropdown';
import AddImageList from './AddImageList';
import DatePicker from 'react-native-date-picker';
import NButton from '../../../../components/reusable/Neuromorphic/Buttons/NButton';
import GetLocation from 'react-native-get-location';
import moment from 'moment';

export default class CreatePost extends BaseLoggedInScreen {
  constructor(props) {
    super(props);
    this.createStylesheet();
    this.getSettings();
    this.item = React.createRef(null);
    this.desc = React.createRef(null);
    this.location = React.createRef(null);
    this.postID = this.props.route.params.postID;
    this.types = [
      {label: 'Found', value: 'found'},
      {label: 'Lost', value: 'lost'},
    ];
    this.addImgList = React.createRef(null);
    this.categories = [
      {label: 'Electronics', value: 'e1'},
      {label: 'Clothing', value: 'e2'},
    ];
    this.state = {
      open: false,
      type: null,
      date: new Date(),
      category: null,
      location: null,
      categories: [
        {label: 'Electronics', value: 'e1'},
        {label: 'Clothing', value: 'e2'},
      ],
    };
    this.datePicker = React.createRef(null);
    //this.validatePost = this.validatePost.bind(this);
  }

  createStylesheet() {
    this.styles = {
      bgContainer: {
        flex: 1,
        backgroundColor: this.getBgColor(),
        justifyContent: 'flex-start',
        alignItems: 'center',
      },
      mainContainer: {
        width: this.getWinW() * 0.8,
        height: this.getWinH() * 1.55,
      },
      middleInnerContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
      },
      middleInnerContainerHorzPadding: {
        paddingHorizontal: this.getWinW() * 0.8 * 0.8 * 0.1,
      },
      verticalSpacer: {
        height: this.getWinH() * 0.03,
      },
      horizontalSpacer: {
        width: this.getWinW() * 0.06,
      },
      styledText: {
        flex: 1,
        textAlign: 'left',
        fontFamily: 'Sisterhood',
        fontSize: 30,
      },
      styledText2: {
        flex: 1,
        textAlign: 'left',
        fontFamily: 'Nunito-Light',
        fontSize: 15,
      },
      placeholder: {
        alignItems: 'flex-start',
        backgroundColor: 'yellow',
        flex: 1,
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
      descCatContainer: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingVertical: 15,
      },
    };
  }

  getSettings() {
    this.nSettings = {
      topCard: {
        color: this.getBgColor(),
        width: this.getWinW() * 0.8,
        height: this.getWinH() * 0.9 * 0.3,
        innerPadding: 10,
        flexDirection: 'column',
        shadowRadius: 4,
        blur: true,
      },
      middleCard: {
        color: this.getBgColor(),
        width: this.getWinW() * 0.8,
        height: this.getWinH() * 0.15,
        flexDirection: 'column',
        shadowRadius: 4,
        blur: true,
        innerPadding: 5,
      },
      bottomCard: {
        color: this.getBgColor(),
        width: this.getWinW() * 0.8,
        height: this.getWinH() * 0.25,
        innerPadding: 10,
        flexDirection: 'column',
        shadowRadius: 4,
        blur: true,
      },
      itemTextField: {
        color: this.getBgColor(),
        width: this.winW * 0.8 * 0.7,
        height: this.winH * 0.8 * 0.06,
        shadowRadius: 3,
        innerShadow: false,
        blur: false,
      },
      dropdown: {
        color: this.getBgColor(),
        width: this.getWinW() * 0.8 * 0.8 * 0.6,
        height: this.winH * 0.8 * 0.06,
        shadowRadius: 3,
        innerShadow: false,
        blur: false,
      },
      nTextField: {
        color: this.getBgColor(),
        width: this.winW * 0.8 * 0.9,
        height: this.winH * 0.8 * 0.08,
        shadowRadius: 3,
        innerShadow: false,
        blur: false,
      },
      datePickerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
      },
      separator: {
        width: 100,
        height: 100,
      },
      postBtn: {
        color: this.getPrimaryColor(),
        width: this.winW * 0.8,
        height: this.winH * 0.8 * 0.08,
        shadowRadius: 2,
      },
    };
  }
  //static contextType = AppContext;

  async getLocation() {
    await GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
    })
      .then(location => {
        //console.log('loc: ' + JSON.stringify(location));
        this.setState({location: location});
      })
      .catch(error => {
        const {code, message} = error;
        console.warn(code, message);
      });
  }

  async setPost() {
    console.log('postC:' + JSON.stringify(this.getPostsController()));
    const post = await this.getPostsController()
      .getPostByID(this.postID)
      .then(_res => {
        return _res;
      });
    console.log('toSetPost', JSON.stringify(post));
    this.setState({type: post.isLost === 1 ? 'lost' : 'found'});
    console.log('setting itemName', post.itemName);
    this.item.current.setText(post.itemName);
    console.log('setting itemDescription', post.itemDescription);
    this.desc.current.setText(post.itemDescription);
    console.log('setting category', post.category.id);
    this.setState({category: post.category.id});
    console.log('setting images', post.images);
    this.addImgList.current.setImageUris(post.images);
    console.log('setting location', post.location);
    this.location.current.setText(post.location);
    console.log('setting date', post.date);
    let date = new Date(post.date);
    const time = moment(post.time, 'HH:mm:ss').toDate();
    console.log('setting time', time);
    date.setTime(time.getTime());
    console.log('setting datetime:', date);
    this.setState({date: date});
  }

  validatePost = async () => {
    const photos = this.addImgList.current.getImageUris();
    const photoTypes = this.addImgList.current.getPhotoTypes();
    const photoNames = this.addImgList.current.getPhotoNames();
    const type = this.state.type;
    const date = this.state.date;
    const category = this.state.category;
    const item = this.item.current.getText();
    const desc = this.desc.current.getText();
    const location = this.location.current.getText();
    //await this.getLocation();
    console.log('photos:' + JSON.stringify(photos));
    console.log('type:' + JSON.stringify(type));
    console.log('category:' + JSON.stringify(category));
    console.log('item:' + JSON.stringify(item));
    console.log('desc:' + JSON.stringify(desc));
    console.log('date:' + JSON.stringify(date));
    console.log('location: ' + this.location.current.getText());
    const response = await this.getPostsController()
      .createPost(
        photos,
        photoTypes,
        photoNames,
        type,
        date,
        category,
        item,
        desc,
        location,
        this.getUser(),
      )
      .then(res => {
        console.log('createPostRes:' + JSON.stringify(res));
        return res;
      });
    this.nav('Account');
  };

  validateEdit = () => {
    const photos = this.addImgList.current.getImageUris();
    const type = this.state.type;
    const date = this.state.date;
    const category = this.state.category;
    const item = this.item.current.getText();
    const desc = this.desc.current.getText();
    const location = this.state.location;
    this.getPostsController().editPost(
      this.postID,
      item,
      type === 'lost' ? 1 : 0,
      photos,
      location,
      date,
      desc,
      category,
    );
  };

  async componentDidMount() {
    console.log('navProps:' + JSON.stringify(this.props.navigation));
    console.log('controllers:' + JSON.stringify(this.getControllers()));
    console.log('postID: ' + this.postID);
    await this.getControllers()
      .categoriesController.getCategories()
      .then(categories =>
        this.setState({
          categories: categories,
        }),
      );

    if (!(this.postID === undefined)) {
      console.log('edit mode');
      await this.setPost();
    } else {
    }
  }

  render() {
    if (this.postID === undefined) {
      console.log('postID is null');
    } else {
      console.log('postID is not null');
    }
    console.log('User is:' + this.getLoginController().getUser());
    return (
      <View style={{flex: 1, backgroundColor: this.getBgColor()}}>
        <ScrollView
          contentContainerStyle={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: this.getBgColor(),
          }}>
          <View>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={this.styles.mainContainer}>
                <View style={this.styles.verticalSpacer} />
                <NCard settings={this.nSettings.topCard}>
                  <AddImageList
                    ref={this.addImgList}
                    color={this.getBgColor()}
                    winW={this.getWinW()}
                    winH={this.getWinH()}
                  />
                </NCard>
                <View style={this.styles.verticalSpacer} />
                <NCard settings={this.nSettings.middleCard}>
                  <View
                    style={[
                      this.styles.middleInnerContainer,
                      this.styles.middleInnerContainerHorzPadding,
                    ]}>
                    <Text style={this.styles.styledText}>Today...I...</Text>
                    <NCard settings={this.nSettings.dropdown}>
                      <Dropdown
                        itemContainerStyle={this.styles.dropdownListContainer}
                        containerStyle={this.styles.dropdownListContainer}
                        style={this.styles.dropdown}
                        data={this.types}
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder="Found/Lost"
                        placeholderStyle={this.styles.styledText2}
                        itemTextStyle={this.styles.styledText2}
                        selectedTextStyle={this.styles.styledText2}
                        value={this.state.type}
                        onChange={item => {
                          this.setState({type: item.value});
                        }}
                      />
                    </NCard>
                  </View>
                  <View
                    style={[
                      this.styles.middleInnerContainer,
                      this.styles.middleInnerContainerHorzPadding,
                    ]}>
                    <Text style={this.styles.styledText}>a...</Text>
                    <NTextInput
                      ref={this.item}
                      settings={this.nSettings.itemTextField}
                      placeholder={'Item'}
                    />
                  </View>
                </NCard>
                <View style={this.styles.verticalSpacer} />
                <NCard settings={this.nSettings.bottomCard}>
                  <View style={this.styles.datePickerContainer}>
                    <DatePicker
                      date={this.state.date}
                      onDateChange={date => this.setState({date: date})}
                    />
                  </View>
                </NCard>
                <View style={this.styles.verticalSpacer} />
                <NCard settings={this.nSettings.middleCard}>
                  <View style={this.styles.descCatContainer}>
                    <Text style={this.styles.styledText}>
                      The item looks like...
                    </Text>
                    <NTextInput
                      ref={this.desc}
                      settings={this.nSettings.nTextField}
                      placeholder={'Description'}
                    />
                  </View>
                </NCard>
                <View style={this.styles.verticalSpacer} />
                <NCard settings={this.nSettings.middleCard}>
                  <View style={this.styles.descCatContainer}>
                    <Text style={this.styles.styledText}>
                      This item belongs to the ...
                    </Text>
                    <View style={this.styles.middleInnerContainer}>
                      <NCard settings={this.nSettings.dropdown}>
                        <Dropdown
                          itemContainerStyle={this.styles.dropdownListContainer}
                          containerStyle={this.styles.dropdownListContainer}
                          style={this.styles.dropdown}
                          data={this.state.categories}
                          itemTextStyle={this.styles.styledText2}
                          selectedTextStyle={this.styles.styledText2}
                          placeholderStyle={this.styles.styledText2}
                          maxHeight={300}
                          labelField="label"
                          valueField="value"
                          placeholder="Select Category"
                          value={this.state.category}
                          onChange={item => {
                            this.setState({category: item.value});
                          }}
                        />
                      </NCard>
                      <View style={this.styles.horizontalSpacer} />
                      <Text style={this.styles.styledText}>Category</Text>
                    </View>
                  </View>
                </NCard>
                <View style={this.styles.verticalSpacer} />
                <NCard settings={this.nSettings.middleCard}>
                  <View style={this.styles.descCatContainer}>
                    <Text style={this.styles.styledText}>
                      The item was last seen at
                    </Text>
                    <NTextInput
                      ref={this.location}
                      settings={this.nSettings.nTextField}
                      placeholder={'Description'}
                    />
                  </View>
                </NCard>
                <View style={this.styles.verticalSpacer} />
                <NButton
                  style={{flex: 1}}
                  settings={this.nSettings.postBtn}
                  onPress={!this.postID ? this.validatePost : this.validateEdit}
                  label={!this.postID ? 'Post' : 'Save'}
                  fontFamily={this.getButtonFont()}
                  textColor={this.getSecondaryColor()}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </ScrollView>
      </View>
    );
  }
}
