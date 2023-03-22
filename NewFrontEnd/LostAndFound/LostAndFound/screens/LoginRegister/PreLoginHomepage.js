import {Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import NCard from '../../components/reusable/NCard';
import NButtonBlur from '../../components/reusable/NButtonBlur';
import BaseScreen from '../BaseScreen';
import NCardBlur from '../../components/reusable/NCardBlur';
import NButton from '../../components/reusable/NButton';

export default class PreLoginHomepage extends BaseScreen {
  constructor(props) {
    super(props);
    this.props = props;
    this.styles = StyleSheet.create({
      imgContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      titleContainer: {
        flex: 2,
        height: this.getWinW() * 0.8 * 0.1,
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'column',
      },
      title: {
        color: this.getPrimaryColor(),
        fontFamily: 'SundayBest',
        fontSize: 25,
      },
      spacer: {flex: 1, height: this.getWinH() * 0.8 * 0.2},
      btnContainer: {flex: 3, justifyContent: 'space-around'},
      container: {
        flex: 1,
        backgroundColor: this.getBgColor(),
        alignItems: 'center',
        justifyContent: 'center',
      },
      image: {width: 147, height: 147, borderRadius: 75}
    });
  }
  render() {
    return (
      // eslint-disable-next-line react/react-in-jsx-scope
      <View style={this.styles.container}>
        {/* eslint-disable-next-line react/react-in-jsx-scope */}
        <NCardBlur
          outer
          justifyContent={'flex-start'}
          rectangular
          color={this.getBgColor()}
          width={this.getWinW() * 0.8}
          height={this.getWinH() * 0.8}
          innerPadding={40}
          flexDirection={'column'}
          shadowRadius={4}>
          {/* eslint-disable-next-line react/react-in-jsx-scope */}
          <NCard color={this.getBgColor()} radius={100} shadowRadius={3}>
            <View style={[this.styles.imgContainer]}>
              <NCard
                innerShadow
                color={this.getBgColor()}
                radius={80}
                shadowRadius={10}
                style={[this.styles.imgContainer]}>
                <Image
                  source={require('../../assets/images/logo.png')}
                  style={this.styles.image}
                />
              </NCard>
            </View>
          </NCard>

          <View style={this.styles.titleContainer}>
            <Text style={this.styles.title}>Lost & Found</Text>
          </View>
          <View style={this.styles.spacer} />
          <View style={this.styles.btnContainer}>
            <NButtonBlur
              label={'LOGIN'}
              rectangular
              color={this.getPrimaryColor()}
              width={this.getWinW() * 0.8 * 0.8}
              height={this.getWinH() * 0.8 * 0.1}
              onPress={() => this.navigate('LoginPage')}
              shadowRadius={2}
              textColor={this.getBgColor()}
              fontFamily={this.getButtonFont()}
            />
            <NButtonBlur
              label={'REGISTER'}
              rectangular
              color={this.getSecondaryColor()}
              width={this.winW * 0.8 * 0.8}
              height={this.winH * 0.8 * 0.1}
              onPress={() => this.navigate('RegisterPage')}
              shadowRadius={2}
              textColor={this.getPrimaryColor()}
              fontFamily={this.getButtonFont()}
            />
          </View>
        </NCardBlur>
      </View>
    );
  }
}
