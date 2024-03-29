import {Text, Keyboard, TouchableWithoutFeedback, View} from 'react-native';
import {AppContext} from '../../../../contexts/Contexts';
import BaseScreen from '../../../BaseScreen';
import BaseLoggedInScreen from '../../BaseLoggedInScreen';
import NCard from '../../../../components/reusable/Neuromorphic/Cards/NCard';
import NTextInput from '../../../../components/reusable/Neuromorphic/TextInput/NTextInput';
import {Dropdown} from 'react-native-element-dropdown';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ListView from '../Search/InnerViews/ListView';
import Map_View from './InnerViews/Map_View';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

const InnerView = createMaterialTopTabNavigator();

export default class Search extends BaseLoggedInScreen {
  constructor(props) {
    super(props);
    console.log('props:' + this.props);
    this.createStylesheet();
    this.getSettings();
    this.searchField = React.createRef(null);
    this.params = {
      bgColor: this.getBgColor(),
      winW: this.getWinW(),
      winH: this.getWinH(),
      primaryColor: this.getPrimaryColor(),
      secondaryColor: this.getSecondaryColor(),
      callColor: this.getCallColor(),
      buttonFont: this.getButtonFont(),
      screenW: this.getWinW(),
      screenH: this.getWinH() * 0.8,
    };
    this.state = {
      searchTypes: [
        //{label: 'All', value: 'All'},
        {label: 'User', value: 'User'},
        {label: 'Item', value: 'Item'},
        //{label: 'Location', value: 'Location'},
      ],
      viewTypes: [
        {label: 'List', value: 'ListView'},
        {label: 'Map', value: 'Map_View'},
      ],
      categories: [
        {label: 'Electronics', value: 'e1'},
        {label: 'Clothing', value: 'e2'},
      ],
      category: 'All',
      viewType: 'ListView',
      searchType: 'User',
      params: {...this.params, postLst: [], searchText: ''},
    };
    this.innerView = React.createRef(null);
  }

  getSettings() {
    this.nSettings = {
      topCard: {
        color: '#FAF9F6',
        width: this.getWinW(),
        height: this.getWinH() * 0.22,
        blur: false,
        shadowRadius: 4,
      },
      search: {
        color: '#FAF9F6',
        width: this.getWinW() * 0.8 * 0.77,
        height: this.getWinH() * 0.05,
        blur: false,
        shadowRadius: 4,
      },
      dropdown: {
        color: '#FAF9F6',
        width: this.getWinW() * 0.8 * 0.52,
        height: this.getWinH() * 0.05,
        blur: false,
        shadowRadius: 4,
        innerPadding: 0,
      },
      viewDropDown: {
        color: '#FAF9F6',
        width: this.getWinW() * 0.8 * 0.3,
        height: this.getWinH() * 0.05,
        blur: false,
        shadowRadius: 4,
        innerPadding: 0,
      },
    };
  }

  createStylesheet() {
    this.styles = {
      bg: {
        height: '23%',
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: this.getBgColor(),
      },
      topContainer: {
        paddingTop: this.getWinH() * 0.04,
        paddingHorizontal: '5%',
        alignItems: 'center',
        flexDirection: 'column',
      },
      topInnerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        flex: 1,
      },
      horzSpacer: {
        width: '5%',
      },
      vertSpacer: {
        height: '55%',
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
      styledText2: {
        flex: 1,
        textAlign: 'left',
        fontFamily: 'Nunito-Light',
        fontSize: 15,
      },
    };
  }

  // displayCategoryPosts(category) {
  //   this.state.params.searchText = user;
  //   this.validateSearch().then();
  //   this.state.searchType = 'User';
  //   this.state.category = category;
  // }

  validateSearch = async () => {
    let postLst = [];
    const searchText = this.searchField.current.getText();
    console.log('viewType is:' + this.state.viewType);
    if (this.state.searchType === 'User') {
      postLst = await this.getPostsController().getPostsFromUser(
        searchText,
        this.state.category,
      );
      console.log('UserPosts__!' + JSON.stringify(postLst));
    }
    if (this.state.searchType === 'Item') {
      postLst = await this.getPostsController()
        .searchByItemAndCat(searchText, this.state.category)
        .then(_posts => {
          console.log('newSearchPosts:' + JSON.stringify(_posts));
          return _posts;
        });
    }
    console.log('postLst:' + JSON.stringify(postLst));
    this.setState({
      params: {
        ...this.params,
        postLst: postLst,
        searchText: searchText,
      },
    });
    console.log('postList___', JSON.stringify(this.state.params.postLst));
    console.log('before searchText:', searchText);
    if (this.state.viewType === 'ListView') {
      this.navigate('ListView', this.state.params);
    } else {
      this.navigate('Map_View', this.state.params);
    }
  };
  renderHeader = ({navigation}) => {
    console.log('rendering Header');
    console.log(navigation);
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={this.styles.bg}>
          <NCard settings={this.nSettings.topCard}>
            <View style={this.styles.topContainer}>
              <View style={this.styles.topInnerContainer}>
                <NTextInput
                  text={this.state.params.searchText}
                  autocorrect={false}
                  ref={this.searchField}
                  placeholder="Search"
                  settings={this.nSettings.search}
                  onSubmit={this.validateSearch}
                />
                <View style={this.styles.horzSpacer} />
                <NCard settings={this.nSettings.viewDropDown}>
                  <Dropdown
                    itemContainerStyle={this.styles.dropdownListContainer}
                    containerStyle={this.styles.dropdownListContainer}
                    style={this.styles.dropdown}
                    data={this.state.viewTypes}
                    itemTextStyle={this.styles.styledText2}
                    selectedTextStyle={this.styles.styledText2}
                    placeholderStyle={this.styles.styledText2}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="List"
                    value={this.state.viewType}
                    onChange={item => {
                      this.setState({viewType: item.value});
                      console.log('navigating to:' + item.value);
                      navigation.navigate(item.value);
                    }}
                  />
                </NCard>
              </View>
              <View style={this.styles.vertSpacer} />
              <View style={this.styles.topInnerContainer}>
                <NCard settings={this.nSettings.dropdown}>
                  <Dropdown
                    itemContainerStyle={this.styles.dropdownListContainer}
                    containerStyle={this.styles.dropdownListContainer}
                    style={this.styles.dropdown}
                    data={this.state.searchTypes}
                    itemTextStyle={this.styles.styledText2}
                    selectedTextStyle={this.styles.styledText2}
                    placeholderStyle={this.styles.styledText2}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Search Type"
                    value={this.state.searchType}
                    onChange={item => {
                      this.setState({searchType: item.value});
                    }}
                  />
                </NCard>
                <View style={this.styles.horzSpacer} />
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
              </View>
            </View>
          </NCard>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  async componentDidMount() {
    this.focusSub = this.props.navigation.addListener('focus', () => {});
    const response = await this.getControllers()
      .categoriesController.getCategories()
      .then(result => {
        console.log('catRes:' + JSON.stringify(result));
        return result;
      });
    const newCats = [{label: 'All', value: 'All'}];
    response.map(cat => {
      newCats.push(cat);
    });
    this.setState({
      categories: newCats,
    });
  }

  render() {
    const Header = props => {
      return this.renderHeader(props);
    };
    return (
      <InnerView.Navigator
        screenOptions={{swipeEnabled: false}}
        initalRouteName="ListView"
        tabBarPosition="top"
        tabBar={props => <Header {...props} />}>
        <InnerView.Screen
          name="ListView"
          component={ListView}
          test={'helloWorld'}
          initialParams={this.state.params}
        />
        <InnerView.Screen
          name="Map_View"
          component={Map_View}
          initialParams={this.state.params}
        />
      </InnerView.Navigator>
    );
  }
}
