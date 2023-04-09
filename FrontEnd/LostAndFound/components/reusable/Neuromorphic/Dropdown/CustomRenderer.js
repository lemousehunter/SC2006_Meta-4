import {renderers} from 'react-native-popup-menu';
import {computePosition} from 'react-native-popup-menu/src/renderers/ContextMenu';
import {Animated, I18nManager, PixelRatio, StyleSheet} from 'react-native';

/**
 * CustomRenderer is a class that extends the ContextMenu renderer from the
 * react-native-popup-menu library. It adds animation, positioning, and styling
 * to the context menu component.
 */
export default class CustomRenderer extends renderers.ContextMenu {

  /**
   * Constructs a new CustomRenderer with the given props.
   *
   * @param props the props to pass to the context menu component
   */
  constructor(props) {
    super(props);
  }

  /**
   * Renders the context menu with animation, positioning, and styling.
   *
   * @return the rendered context menu component
   */
  render() {
    const {style, children, layouts, ...other} = this.props;
    const animation = {
      transform: [{scale: this.state.scaleAnim}],
      opacity: this.state.scaleAnim,
    };
    const position = computePosition(layouts, I18nManager.isRTL);
    return (
      <Animated.View
        {...other}
        style={[styles.options, style, animation, position]}>
        {children}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  options: {
    position: 'absolute',
    borderRadius: 2,
    backgroundColor: 'white',
    width: PixelRatio.roundToNearestPixel(200),

    // Shadow only works on iOS.
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowOffset: { width: 3, height: 3 },
    shadowRadius: 4,

    // This will elevate the view on Android, causing shadow to be drawn.
    elevation: 5,
  },
});
