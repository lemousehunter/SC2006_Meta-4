import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Neomorph, NeomorphBlur} from 'react-native-neomorph-shadows';

export default class NCardBase extends React.PureComponent {
  constructor(props) {
    // props.settings = {rectangular, innerShadow, color, width, height, justifyContent, alignItems, innnerPadding, showShadow, shadowRadius, borderRadius, flexDirection}
    super(props);
    this.settings = this.props.settings;
    this.setDefaults();
    this.color = this.settings.color;
    this.width = this.settings.width;
    this.height = this.settings.height;
    this.borderRadius = this.settings.borderRadius;
    this.state = {shadowRadius: this.shadowRadius};
    this.innerShadow =
      this.props.innerShadow == null
        ? this.innerShadow
        : this.props.innerShadow;
    this.createStylesheet();
  }

  createStylesheet() {
    this.styles = StyleSheet.create({
      main: {
        shadowRadius: this.showShadow ? this.shadowRadius : 0,
        borderRadius: this.borderRadius,
        backgroundColor: this.color,
        width: this.width,
        height: this.height,
        justifyContent: this.justifyContent,
        alignItems: this.alignItems,
      },
      center: {
        justifyContent: this.justifyContent,
        alignItems: this.alignItems,
      },
      flexDirection: {flexDirection: this.flexDirection},
      padding: {
        padding: this.innerPadding,
      },
    });
  }

  setInnerShadow(innerShadow) {
    this.innerShadow = innerShadow;
  }

  setDefaults() {
    this.innerShadow =
      this.settings.innerShadow == null ? false : this.settings.innerShadow;
    this.justifyContent =
      this.settings.justifyContent == null
        ? 'center'
        : this.settings.justifyContent;
    this.alignItems =
      this.settings.alignItems == null ? 'center' : this.settings.alignItems;
    this.innerPadding =
      this.settings.innerPadding == null ? 0 : this.settings.innerPadding;
    this.showShadow =
      this.settings.showShadow == null ? true : this.settings.showShadow;
    this.shadowRadius =
      this.settings.shadowRadius == null ? 12 : this.settings.shadowRadius;
    this.flexDirection =
      this.settings.flexDirection == null ? 'row' : this.settings.flexDirection;
    this.blur = this.settings.blur == null ? false : this.settings.blur;
  }

  render() {
    const NComponent = this.settings.blur ? NeomorphBlur : Neomorph;
    return (
      <NComponent
        inner={this.innerShadow} // <- enable shadow inside of neomorph
        swapShadows // <- change zIndex of each shadow color
        style={this.styles.main}>
        <View
          style={[
            this.styles.center,
            this.styles.padding,
            this.styles.flexDirection,
          ]}>
          {this.props.children}
        </View>
      </NComponent>
    );
  }
}
