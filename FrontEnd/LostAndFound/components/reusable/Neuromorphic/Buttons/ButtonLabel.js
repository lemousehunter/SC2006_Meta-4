import Animated, {useAnimatedStyle, withSpring} from 'react-native-reanimated';
import {StyleSheet, View} from 'react-native';

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
