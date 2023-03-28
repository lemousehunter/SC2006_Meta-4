import {Dimensions, StyleSheet, Text, View} from 'react-native';
import NButton from '../../components/reusable/Neuromorphic/Buttons/NButton';
import BaseScreen from '../BaseScreen';
import HomeScreen from '../LoggedIn/tabbedScreens/Home/HomeScreen';
import BGWithNCard from '../../components/reusable/Neuromorphic/BackgroundWithNCard';
import {AppContext} from '../../contexts/Contexts';

export default class LoginPage extends BaseScreen {
  constructor(props) {
    super(props);
    this.createStyleSheet();
    this.getSettings();
  }

  static contextType = AppContext;
  createStyleSheet() {
    this.style = StyleSheet.create({
      mainContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 4,
      },
      titleContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 2,
      },
      btnContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'space-around',
        flex: 2,
        gap: 10,
      },
      btnSpacer: {
        flex: 2,
      },
      titleText: {
        color: this.getPrimaryColor(),
        fontFamily: 'SundayBest',
        fontSize: 25,
      },
    });
  }

  getSettings() {
    this.nSettings = {
      registerBtn: {
        color: this.getPrimaryColor(),
        width: this.getWinW() * 0.8 * 0.35,
        height: this.getWinH() * 0.8 * 0.09,
        shadowRadius: 2,
      },
      backBtn: {
        color: this.getSecondaryColor(),
        width: this.getWinW() * 0.8 * 0.35,
        height: this.getWinH() * 0.8 * 0.09,
        shadowRadius: 2,
      },
    };
  }
  render() {
    return (
      <BGWithNCard
        winW={this.getWinW()}
        winH={this.getWinH()}
        bgColor={this.getBgColor()}>
        <View style={this.style.titleContainer}>
          <Text style={this.style.titleText}>Register Page</Text>
        </View>
        <View style={this.style.btnContainer}>
          <NButton
            settings={this.nSettings.registerBtn}
            label={'Register'}
            fontFamily={this.getButtonFont()}
            textColor={this.getBgColor()}
            style={{alignSelf: 'flex-start'}}
          />
          <View style={this.style.btnSpacer}></View>
          <NButton
            settings={this.nSettings.backBtn}
            onPress={() => this.navigate('PreLoginHomepage')}
            label={'Back'}
            fontFamily={this.getButtonFont()}
            textColor={this.getPrimaryColor()}
          />
        </View>
      </BGWithNCard>
    );
  }
}
