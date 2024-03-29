import {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import NCard from './reusable/Neuromorphic/Cards/NCard';

/**
 * A component that displays a list with a title and content.
 */
export default class TitleFlatList extends Component {
  /**
   * Constructs a new instance of the TitleFlatList component.
   *
   * @param props The component properties.
   * @param props.winH The window height.
   * @param props.winW The window width.
   * @param props.bgColor The background color.
   * @param props.title The title text to display.
   * @param props.children The content to display.
   */
  constructor(props) {
    super(props);
    this.createStylesheet();
    this.getSettings();
  }
  /**
   * Creates the component stylesheet.
   */
  createStylesheet() {
    this.styles = StyleSheet.create({
      mainContainer: {
        //backgroundColor: 'yellow',
        paddingTop: this.props.winH * 0.02,
        paddingBottom: this.props.winH * 0.04,
        paddingLeft: this.props.winW * 0.01,
        justifyContent: 'center',
        alignItems: 'center',
      },
      titleText: {
        textAlign: 'left',
        fontFamily: 'Panton-BlackCaps',
        fontWeight: 'bold',
        fontSize: 30,
      },
      titleContainer: {
        //backgroundColor: 'red',
        paddingLeft: this.props.winW * 0.03,
        width: this.props.winW * 0.8,
        height: this.props.winH * 0.35 * 0.2,
      },
      contentContainer: {
        width: this.props.winW * 0.8,
        height: this.props.winH * 0.35 * 0.8,
      },
    });
  }
  /**
   * Gets the component settings.
   */
  getSettings() {
    this.nSettings = {
      containerCard: {
        color: this.props.bgColor,
        width: this.props.winW * 0.9,
        height: this.props.winH * 0.35,
        flexDirection: 'column',
        shadowRadius: 7,
        borderRadius: 25,
        blur: false,
      },
      contentContainerCard: {
        color: this.props.bgColor,
        width: this.props.winW * 0.8 * 0.95,
        height: this.props.winH * 0.35 * 0.7,
        flexDirection: 'column',
        shadowRadius: 7,
        borderRadius: 25,
        blur: true,
      },
    };
  }
  /**
   * Renders the component.
   *
   * @return The rendered component.
   */
  render() {
    return (
      <NCard settings={this.nSettings.containerCard}>
        <View style={this.styles.mainContainer}>
          <View style={this.styles.titleContainer}>
            <Text style={this.styles.titleText}>{this.props.title}</Text>
          </View>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <NCard settings={this.nSettings.contentContainerCard}>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                {this.props.children}
              </View>
            </NCard>
          </View>
        </View>
      </NCard>
    );
  }
}
