import React from 'react';
import BaseInnerView from './tabbedScreens/Search/InnerViews/BaseInnerView';
import {Button, StyleSheet, Text, View} from 'react-native';
import NCard from '../../components/reusable/Neuromorphic/Cards/NCard';

/**
 * NonTabbedScreenContainer is a class that extends BaseInnerView and is used to display a screen without tabs.
 */
export default class NonTabbedScreenContainer extends BaseInnerView {

  /**
   * Constructor for NonTabbedScreenContainer class.
   * 
   * @param {Object} props - The props that will be passed to the component.
   */
  constructor(props) {
    super(props);
    this.createStylesheet();
    this.getSettings();
  }

  /**
   * Sets the nSettings object which defines the properties of the title card.
   */
  getSettings() {
    this.nSettings = {
      titleCard: {
        color: '#FAF9F6',
        width: this.getWinW(),
        height: this.getWinH() * 0.15,
        blur: false,
        shadowRadius: 4,
      },
    };
  }

  /**
   * Creates the stylesheet object used to style the component.
   */
  createStylesheet() {
    this.styles = StyleSheet.create({
      bg: {
        backgroundColor: this.getBgColor(),
        flex: 1,
      },
      titleContainer: {
        paddingTop: this.getWinH() * 0.04,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: this.props.title ? this.getWinH() * 0.1 : this.getWinH() * 0.08,
        width: this.getWinW(),
      },
      contentContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: this.getWinH() * 0.9,
        width: this.getWinW(),
      },
      title: {
        textAlign: 'center',
        fontFamily: 'Quicksand',
        fontWeight: 'bold',
        fontSize: 30,
      },
    });
  }

  /**
   * Renders the content of the screen.
   *
   * @return {JSX.Element} A JSX element representing the content of the screen.
   */
  renderContent() {
    if (!this.props.title) {
      return (
        <View style={this.styles.titleContainer}>
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
          <Text style={this.styles.title}> {this.props.title} </Text>
        </View>
      );
    } else {
      return (
        <NCard settings={this.nSettings.titleCard}>
          <View style={this.styles.titleContainer}>
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
            <Text style={this.styles.title}> {this.props.title} </Text>
          </View>
        </NCard>
      );
    }
  }

  /**
Renders the content of the non-tabbed screen container component.
Returns a React element representing the non-tabbed screen container.
@return {React.Element} A React element representing the non-tabbed screen container.
*/
  render() {
    return (
      <View style={this.styles.bg}>
        {this.renderContent()}
        <View style={this.styles.contentContainer}>{this.props.children}</View>
      </View>
    );
  }
}
