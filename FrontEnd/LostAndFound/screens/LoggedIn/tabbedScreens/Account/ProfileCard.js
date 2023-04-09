import React from 'react';
import NCard from '../../../../components/reusable/Neuromorphic/Cards/NCard';
import {Image, Text, View} from 'react-native';
import NButton from '../../../../components/reusable/Neuromorphic/Buttons/NButton';
import {StyleSheet} from 'react-native';

export default class ProfileCard extends React.Component {
  constructor(props) {
    super(props);

    this.color = this.props.color;
    this.primaryColor = this.props.primaryColor;
    this.secondaryColor = this.props.secondaryColor;
    this.callColor = this.props.callColor;
    this.buttonFont = this.props.btnFont;
    this.winW = this.props.winW;
    this.winH = this.props.winH;
    this.name = this.props._name;
    this.username = this.props.username;
    this.userSince = this.props.userSince;
    this.socialRep = this.props.socialRep;
    this.numPosts = this.props.numPosts;
    this.logout = this.props.logout;
    this.edit = this.props.edit;
    this.del = this.props.del;
    this.user = this.props.user;
    this.currentUser = this.props.currentUser;
    this.getStyleSheet();
    this.getNSettings();
  }

  getStyleSheet() {
    this.styles = StyleSheet.create({
      mainContainer: {
        paddingTop: this.currentUser === this.user ? this.winW * 0.2 : 0,
        flex: 1,
        width: this.winW,
        flexDirection: 'column',
        alignItems: 'center',
      },
      imgContainer: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        flex: 2,
      },
      nameContainer: {
        flex: 1.5,
        justifyContent: 'center',
        alignItems: 'center',
      },
      middleContainer: {
        paddingHorizontal: this.winW * 0.1,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
      },
      middleInnerContainer: {
        flex: 1,
        alignItems: 'center',
      },
      headingText: {
        fontWeight: 'bold',
        fontFamily: 'Panton-BlackCaps',
        fontSize: 35,
      },
      subHeadingText: {
        fontFamily: 'Quicksand',
        fontSize: 17,
      },
      titleText: {
        fontFamily: 'Quicksand',
        fontWeight: 'bold',
        fontSize: 20,
      },
      text: {
        fontFamily: 'Nunito-Light',
        fontSize: 15,
      },
      image: {},
      bottomContainer: {
        paddingHorizontal: this.winW * 0.1,
        flex: 0.5,
        flexDirection: 'row',
      },
    });
  }
  getNSettings() {
    this.nSettings = {
      mainCard: {
        color: this.color,
        width: this.winW * 0.9,
        height: this.winH * 0.3,
        innerPadding: 10,
        flexDirection: 'column',
        shadowRadius: 4,
        blur: true,
      },
      imageCard: {
        color: this.color,
        radius: this.winW * 0.15,
        shadowRadius: 4,
        blur: true,
      },
      logoutBtn: {
        color: this.callColor,
        width: this.winW * 0.8 * 0.4,
        height: this.winH * 0.8 * 0.05,
        shadowRadius: 2,
      },
      editBtn: {
        color: this.primaryColor,
        width: this.winW * 0.8 * 0.4,
        height: this.winH * 0.8 * 0.05,
        shadowRadius: 2,
      },
      contactBtn: {
        color: this.primaryColor,
        width: this.winW * 0.8 * 0.92,
        height: this.winH * 0.8 * 0.05,
        shadowRadius: 2,
      },
    };
  }

  getUserOwnView() {
    return (
      <View style={this.styles.bottomContainer}>
        <NButton
          style={{flex: 1}}
          settings={this.nSettings.editBtn}
          onPress={this.edit}
          label={'Edit'}
          fontFamily={this.buttonFont}
          textColor={this.secondaryColor}
        />
        <View style={{flex: 0.5}} />
        <NButton
          style={{flex: 1}}
          settings={this.nSettings.logoutBtn}
          onPress={this.logout}
          label={'Logout'}
          fontFamily={this.buttonFont}
          textColor={this.secondaryColor}
        />
      </View>
    );
  }

  message(user) {
    console.log('to message:', user);
  }

  getOthersView() {
    return (
      <View style={this.styles.bottomContainer}>
        <NButton
          style={{flex: 1}}
          settings={this.nSettings.contactBtn}
          onPress={() => this.message(this.user)}
          label={'Message'}
          fontFamily={this.buttonFont}
          textColor={this.secondaryColor}
        />
      </View>
    );
  }

  render() {
    console.log('user: ' + this.user);
    console.log('currentUser: ' + this.currentUser);
    return (
      <View style={this.styles.mainContainer}>
        <View style={this.styles.imgContainer}>
          <NCard
            circle={true}
            style={{flex: 1}}
            settings={this.nSettings.imageCard}
          />
        </View>
        <View style={this.styles.nameContainer}>
          <Text style={this.styles.headingText}>{this.props._name} </Text>
          <Text style={this.styles.subHeadingText}>{this.props.username} </Text>
        </View>
        <View style={this.styles.middleContainer}>
          <View style={this.styles.middleInnerContainer}>
            <Text style={this.styles.titleText}>{this.props.socialRep}</Text>
            <Text style={this.styles.text}>Reputation </Text>
          </View>
          <View style={this.styles.middleInnerContainer}>
            <Text style={this.styles.titleText}>{this.props.numPosts}</Text>
            <Text style={this.styles.text}> Posts </Text>
          </View>
          <View style={this.styles.middleInnerContainer}>
            <Text style={this.styles.titleText}>{this.props.userSince}</Text>
            <Text style={this.styles.text}> User Since </Text>
          </View>
        </View>
        {this.currentUser === this.user
          ? this.getUserOwnView()
          : this.getOthersView()}
      </View>
    );
  }
}
