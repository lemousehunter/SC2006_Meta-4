import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Neomorph} from 'react-native-neomorph-shadows';
import {withSpring} from 'react-native-reanimated';
export default class NCard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {shadowRadius: props.shadowRadius};
  }
  render() {
    const {
      rectangular,
      innerShadow,
      color,
      width,
      height,
      radius,
      justifyContent,
      alignItems,
      innerPadding,
      showShadow,
      shadowRadius,
      borderRadius,
      flexDirection,
    } = this.props;
    const borderR = rectangular
      ? borderRadius == null
        ? 20
        : borderRadius
      : radius;
    const w = rectangular ? width : radius * 2;
    const h = rectangular ? height : radius * 2;
    let shadowR = shadowRadius == null ? 12 : shadowRadius;
    if (showShadow === false) {
      shadowR = 0;
    }
    const styles = StyleSheet.create({
      main: {
        shadowRadius: shadowR,
        borderRadius: borderR,
        backgroundColor: color,
        width: w,
        height: h,
        justifyContent: justifyContent,
        alignItems: alignItems,
      },
      center: {justifyContent: 'center', alignItems: 'center'},
      flexDirection: {flexDirection: flexDirection},
      padding: {
        padding: innerPadding,
      },
    });

    return (
      <Neomorph
        inner={innerShadow} // <- enable shadow inside of neomorph
        swapShadows // <- change zIndex of each shadow color
        style={styles.main}>
        <View style={[styles.center, styles.padding, styles.flexDirection]}>
          {this.props.children}
        </View>
      </Neomorph>
    );
  }
}

NCard.defaultProps = {
  justifyContent: 'center',
  alignItems: 'center',
  innerPadding: 0,
  showShadow: true,
  flexDirection: 'row',
};
