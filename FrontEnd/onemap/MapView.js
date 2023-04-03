import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

export default function App() {
  const [location, setLocation] = useState(null);
  const [markers, setMarkers] = useState([]);
  const mapRef = useRef(null);


  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDI2YTJmODdlMzM4MTNmYmJkMWRlMmIiLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE2ODAyNTM3NDV9.EaFEW7ygfeTKe6KGbEF_Vye9zH3CQjThsyO-DLatWRw';

  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        'http://192.168.1.76:3000/api/pins',
        config
      );
      console.log(response);
      setMarkers(response.data);
    } catch (error) {
      console.log('Error fetching data: ', error.message);
      // Handle the error here, e.g. show an error message to the user
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    })();
  }, []);

  useEffect(() => {
  }, []);

  useEffect(() => {
    const locationChanged = (newLocation) => {
      setLocation(newLocation);
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: newLocation.coords.latitude,
          longitude: newLocation.coords.longitude,
          latitudeDelta: 0.00922,
          longitudeDelta: 0.00421,
        });
      }
    };

    const watchId = Location.watchPositionAsync({}, locationChanged);

    return () => {
      Location.stopWatchingPositionAsync(watchId);
    };
  }, []);

  const handleCenterPress = async () => {
    let location = await Location.getCurrentPositionAsync({});
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.00922,
        longitudeDelta: 0.00421,
      });
    }
  };

  if (!location) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  console.log("Markers is HERE:", markers);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.00922,
          longitudeDelta: 0.00421,
        }}
      >
        {markers.map((marker, index) => (
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
        ))}
        <Marker
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          title="Your location"
          pinColor="blue"
        />
      </MapView>
      <TouchableOpacity style={styles.centerButton} onPress={handleCenterPress}>
  <Text style={styles.centerButtonText}>Center on location</Text>
</TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
      right: 20,
    },
    button: {
      backgroundColor: '#fff',
      borderRadius: 5,
      padding: 10,
    },
    buttonText: {
      color: '#333',
      fontWeight: 'bold',
    },
    centerButton: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: '#fff',
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
      centerButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
      },
  });