import Animated, {useAnimatedStyle, withSpring} from 'react-native-reanimated';
import {StyleSheet, View} from 'react-native';

/**
 * Displays a label on a button using React Native's Animated library. The label's text size can be
 * animated by passing in a `derivedTextSize` value.
 *
 * @param derivedTextSize The size of the label's text, which can be animated.
 * @param labelText The text to display in the label.
 * @param color The color of the label's text. Defaults to black if not specified.
 * @param fontFamily The font family to use for the label's text.
 * @return A React Native View component containing an Animated Text component displaying the label.
 */
export default function ButtonLabel({
  derivedTextSize,
  labelText,
  color,
  fontFamily,
}) {
  const animatedLabelTextSize = useAnimatedStyle(() => ({
    fontSize: withSpring(derivedTextSize),
  }));
  const tColor = color == null ? 'black' : color;
  const styles = StyleSheet.create({
    text: {
      color: tColor,
      fontFamily: fontFamily,
    },
  });

  return (
    <View>
      <Animated.Text style={[animatedLabelTextSize, styles.text]}>
        {labelText}
      </Animated.Text>
    </View>
  );
}
