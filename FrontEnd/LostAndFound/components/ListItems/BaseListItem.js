import {Component} from 'react';
import NCard from '../reusable/Neuromorphic/Cards/NCard';
import {StyleSheet, Text, View} from 'react-native';

export default class BaseListItem extends Component {
  constructor(props) {
    super(props);
    this.createStylesheet();
    this.getSettings();
  }
  createStylesheet() {
    this.styles = StyleSheet.create({
      scrollViewC: {
        paddingTop: this.props.params.winH * 0.05,
        width: this.props.params.winW,
        height: this.props.params.winH,
        justifyContent: 'center',
        alignItems: 'center',
      },
      verticalSpacer: {
        height: this.props.params.winH * 0.05,
      },
      mainContainer: {
        paddingTop: this.props.params.winH * 0.015,
        paddingLeft: this.props.params.winW * 0.8 * 0.05,
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: this.props.params.winW * 0.8 * 0.8,
        height: '42%',
      },
      bottomContainer: {
        paddingLeft: this.props.params.winW * 0.8 * 0.05,
        paddingRight: this.props.params.winW * 0.8 * 0.05,
        width: this.props.params.winW * 0.8 * 0.8,
        height: '50%',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      bottomContentContainer: {
        paddingBottom: this.props.params.winH * 0.01,
      },
      titleText: {
        textAlign: 'left',
        fontFamily: 'Quicksand',
        fontSize: 20,
        fontWeight: 'bold',
        flex: 1,
      },
    });
  }

  getSettings() {
    console.log('this.props.bgColor:', this.props.params.bgColor);
    this.nSettings = {
      mainCard: {
        color: this.props.params.bgColor,
        width: this.props.params.winW * 0.8 * 0.8,
        height: this.props.params.winH * 0.12,
        flexDirection: 'column',
        shadowRadius: 5,
        borderRadius: 25,
        blur: false,
      },
    };
  }

  render() {
    return (
      <NCard settings={this.nSettings.mainCard}>
        <View style={this.styles.mainContainer}>
          <Text style={this.styles.titleText}>
            {this.props._data.title}
          </Text>
        </View>
        <View style={this.styles.bottomContainer}>
          <Text>
            {this.props.labels.line2LeftLabel}: {this.props._data.userName}
          </Text>
          <Text>
            {this.props.labels.line2RightLabel}: {this.props._data.status}
          </Text>
        </View>
        <View
          style={[
            this.styles.bottomContainer,
            this.styles.bottomContentContainer,
          ]}>
          {this.props.children}
        </View>
      </NCard>
    );
  }
}
