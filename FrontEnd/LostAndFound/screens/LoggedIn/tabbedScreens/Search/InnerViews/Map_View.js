import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Button,
  Pressable,
} from 'react-native';
import BaseInnerView from './BaseInnerView';
import Geolocation from '@react-native-community/geolocation';
import MapView, {Marker} from 'react-native-maps';
// import { Button } from '@rneui/base';

export default class Map_View extends BaseInnerView {
  constructor(props) {
    super(props);
    this.createStylesheet();
    this.state = {
      location: {coords: {latitude: 1, longitude: 1}},
      markers: [],
    };
    this.map = React.createRef(null);
  }

  createStylesheet() {
    this.styles = StyleSheet.create({
      mainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: this.getBgColor(),
      },
      container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      },
      map: {
        width: '100%',
        height: '100%',
      },
      buttonContainer: {
        position: 'absolute',
        bottom: 20,
        right: 60,
      },
      btnContainer: {
        color: this.getPrimaryColor(),
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        height: 40,
        position: 'absolute',
        top: 40,
        right: 40,
        backgroundColor: this.getPrimaryColor(),
        padding: 10,
        borderRadius: 5,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      icon: {
        width: 30,
        height: 30,
      },
    });
  }

  getCurrentLocation = () => {
    Geolocation.getCurrentPosition(position => {
      console.log('position:' + JSON.stringify(position));
      this.setState({location: position});
      if (this.map.current) {
        this.map.current.animateToRegion({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    });
  };

  watchPos = () => {
    this.watchID = Geolocation.watchPosition(
      position => {
        this.setState({location: position});
        console.log('position:' + JSON.stringify(position));
      },
      error => {
        console.log('Error watching position: ', error);
      },
    );
    console.log('watchID:', this.watchID);
  };

  componentDidMount() {
    console.log('mounting component');
    this.focusSub = this.props.navigation.addListener('focus', () => {
      this.watchPos();
    });
    this.blurSub = this.props.navigation.addListener('blur', () => {
      console.log('unmounting watchID:' + this.watchID);
      Geolocation.clearWatch(this.watchID);
    });
    this.getCurrentLocation();
  }

  renderMarkers() {
    /* Render all the markers from the `markers` state */
    if (this.props.route.params.markers !== undefined) {
      console.log('rendering markers');
      return this.props.route.params.markers.map((marker, index) => (
        <Marker
          key={index}
          coordinate={{
            latitude: marker.latitude,
            longitude: marker.longitude,
          }}
          title={marker.title}
          description={marker.description}
          pinColor="red"
          //onPress={() => navigation.navigate('ScreenName')}
        />
      ));
    }
  }

  render() {
    console.log('rendered mapView');

    return (
      <View style={this.styles.mainContainer}>
        <MapView
          ref={this.map}
          style={this.styles.map}
          initialRegion={{
            latitude: this.state.location.coords.latitude,
            longitude: this.state.location.coords.longitude,
            latitudeDelta: 0.00922,
            longitudeDelta: 0.00421,
          }}>
          {this.renderMarkers()}
          {/* Render the user's current location with a blue pin */}
          <Marker
            coordinate={{
              latitude: this.state.location.coords.latitude,
              longitude: this.state.location.coords.longitude,
            }}
            title="Your location"
            pinColor="blue"
          />
          <TouchableOpacity style={this.styles.btnContainer} onPress={this.getCurrentLocation}>
            <Image
              style={this.styles.icon}
              source={require('../../../../../assets/icons/locationArrow.png')}
            />
          </TouchableOpacity>
        </MapView>
      </View>
    );
  }
}
