import { MAPBOX_API_KEY } from '@env';
import React, {useState, useEffect} from 'react';
import {View, Text, Alert, Pressable, Modal} from 'react-native';
import MapboxGL, {MapView, Camera, PointAnnotation} from '@rnmapbox/maps';
import Geolocation from '@react-native-community/geolocation';

//const token = process.env.MAPBOX_API_KEY;

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
        Longitude: ${longitude}, Latitude: ${latitude},
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
      <View style={mapStyles.modalContainer}>
        <MapView style={mapStyles.map} onPress={onMapPress}>
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
              <View style={mapStyles.userMarker} />
            </PointAnnotation>
          )}
          {selectedCoordinates && (
            <PointAnnotation
              id="selectedPoint"
              coordinate={selectedCoordinates}>
              <View style={mapStyles.marker} />
            </PointAnnotation>
          )}
        </MapView>

        <View style={mapStyles.coordinateContainer}>
          {selectedCoordinates && (
            <>
              <Text>Longitude: {selectedCoordinates[0]}</Text>
              <Text>Latitude: {selectedCoordinates[1]}</Text>
            </>
          )}
          <Pressable style={mapStyles.button} onPress={saveCoordinates}>
            <Text style={mapStyles.buttonText}>Save Location</Text>
          </Pressable>
          <Pressable style={mapStyles.button} onPress={onClose}>
            <Text style={mapStyles.buttonText}>Close Map</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default MapPage;