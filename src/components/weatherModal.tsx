import React from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';

interface WeatherModalProps {
    visible: boolean;
    onClose: () => void;
    weatherData: any;
}

const WeatherModal: React.FC<WeatherModalProps> = ({ visible, onClose, weatherData }) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.contenedor}>
                <View style={styles.modal}>
                    {weatherData ? (
                        <>
                            <Text style={styles.title}>Weather Information</Text>
                            <Text>Temperature: {weatherData.main.temp} °C</Text>
                            <Text>Weather: {weatherData.weather[0].description}</Text>
                            <Text>Humidity: {weatherData.main.humidity}%</Text>
                            <Button title="Close" onPress={onClose} />
                        </>
                    ) : (
                        <Text>Loading...</Text>
                    )}
                </View>
            </View>
        </Modal>
    );
};
const styles = StyleSheet.create({

contenedor:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
 },
modal:{
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10 },

title:{
    fontSize: 18,
    fontWeight: 'bold',
},
},
);

export default WeatherModal;
