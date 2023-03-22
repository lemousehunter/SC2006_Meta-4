import NCard from './NCard';
import {StyleSheet, View} from 'react-native';
import {NeomorphBlur} from 'react-native-neomorph-shadows';

export default class NCardBlur extends NCard {
  constructor(props) {
    super(props);
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
      transparentBG,
    } = this.props;
    const bgr = transparentBG ? '#00000000' : color;
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
        backgroundColor: bgr,
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
      <NeomorphBlur
        inner={innerShadow} // <- enable shadow inside of neomorph
        swapShadows // <- change zIndex of each shadow color
        style={styles.main}>
        <View style={[styles.center, styles.padding, styles.flexDirection]}>
          {this.props.children}
        </View>
      </NeomorphBlur>
    );
  }
}

NCard.defaultProps = {
  justifyContent: 'center',
  alignItems: 'center',
  innerPadding: 0,
  showShadow: true,
  flexDirection: 'row',
  transparentBG: false,
};
