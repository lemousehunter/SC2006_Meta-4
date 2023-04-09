import NCardBase from './NCardBase';
import {StyleSheet} from 'react-native';

export default class NCardCircle extends NCardBase {
  constructor(props) {
    super(props);
    this.radius = this.settings.radius;

    this.state = {shadowRadius: this.shadowRadius};
    this.createStylesheet();
  }

  createStylesheet() {
    this.styles = StyleSheet.create({
      main: {
        shadowRadius: this.shadowRadius,
        borderRadius: this.radius,
        backgroundColor: this.color,
        width: this.radius * 2,
        height: this.radius * 2,
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
}
