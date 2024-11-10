import { MAPBOX_API_KEY } from '@env';
import React, {useState, useEffect} from 'react';
import {View, Text, Alert, Pressable, Modal, StyleSheet} from 'react-native';
import MapboxGL, {MapView, Camera, PointAnnotation} from '@rnmapbox/maps';
import Geolocation from '@react-native-community/geolocation';
import { checkOrRequestLocationPermission } from '../types/checkPermission';


MapboxGL.setAccessToken(MAPBOX_API_KEY);


interface MapPageProps {
  visible: boolean;
  onClose: () => void;
  onSaveCoordinates: (lat: number, lon: number) => void;
}

const MapPage: React.FC<MapPageProps> = ({
  visible,
  onClose,
  onSaveCoordinates,
}) => {
  const [userLocation, setUserLocation] = useState<number[] | null>(null);
  const [selectedCoordinates, setSelectedCoordinates] = useState<
    number[] | null
  >(null);

  const medellinCoordinates = [64.1355, 21.8954];

  const fetchUserLocation = async () => {
    const hasPermission = await checkOrRequestLocationPermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission Required',
        'Location permission is needed to show your location on the map.',
      );
      return;
    }

    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setUserLocation([longitude, latitude]);
      },
      error => {
        Alert.alert('Location Error', error.message);
        console.log('Location error:', error);
        setUserLocation(medellinCoordinates);
      },
    );
  };

  useEffect(() => {
    fetchUserLocation();
  }, []);

  const onMapPress = (event: any) => {
    const {geometry} = event;
    const {coordinates} = geometry;
    setSelectedCoordinates(coordinates);
  };

  const saveCoordinates = () => {
    if (selectedCoordinates) {
      const [longitude, latitude] = selectedCoordinates;
      onSaveCoordinates(latitude, longitude);
      Alert.alert(
        'Coordinates Saved',
        `Longitude: ${longitude}, Latitude: ${latitude}`,
      );
    } else {
      Alert.alert(
        'Selection Required',
        'Please select a location on the map first.',
      );
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <MapView style={styles.map} onPress={onMapPress}>
          {userLocation && (
            <Camera
              centerCoordinate={userLocation}
              zoomLevel={14}
              animationMode="flyTo"
              animationDuration={2000}
            />
          )}
          {userLocation && (
            <PointAnnotation id="userLocation" coordinate={userLocation}>
              <View style={styles.userMarker} />
            </PointAnnotation>
          )}
          {selectedCoordinates && (
            <PointAnnotation
              id="selectedPoint"
              coordinate={selectedCoordinates}>
              <View style={styles.marker} />
            </PointAnnotation>
          )}
        </MapView>

        <View style={styles.coordinateContainer}>
          {selectedCoordinates && (
            <>
              <Text>Longitude: {selectedCoordinates[0]}</Text>
              <Text>Latitude: {selectedCoordinates[1]}</Text>
            </>
          )}
          <Pressable style={styles.button} onPress={saveCoordinates}>
            <Text style={styles.buttonText}>Save Location</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Close Map</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'flex-end',
      },
      map: {
        flex: 1,
      },
      coordinateContainer: {
        padding: 20,
        backgroundColor: 'white',
      },
      userMarker: {
        height: 30,
        width: 30,
        backgroundColor: 'blue',
        borderRadius: 15,
      },
      marker: {
        height: 30,
        width: 30,
        backgroundColor: 'red',
        borderRadius: 15,
      },
      button: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#007BFF',
        borderRadius: 5,
        alignItems: 'center',
      },
      buttonText: {
        color: 'white',
        fontWeight: 'bold',
      },
});


export default MapPage;
