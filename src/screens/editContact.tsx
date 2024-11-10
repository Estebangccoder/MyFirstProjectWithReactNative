//import { checkOrRequestCameraPermission, checkOrRequestGalleryPermissions } from '../types/checkPermission';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Item } from '../types/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { EditDetailsNavigation } from '../../types/navigationTypes';
import MapPage from '../components/mapPage';

import { checkOrRequestCameraPermission} from '../types/checkPermission';

type EditContactRouteProp = RouteProp<{ params: { contact: Item } }, 'params'>;

export const EditContact: React.FC = () => {
    const route = useRoute<EditContactRouteProp>();
    const navigation = useNavigation<EditDetailsNavigation>();
    const { contact } = route.params;

    const [fullname, setFullName] = useState(contact.fullname);
    const [phone, setPhone] = useState(contact.phone);
    const [email, setEmail] = useState(contact.email);
    const [photo, setPhoto] = useState(contact.photo);
    const [latitude, setLatitude] = React.useState<number | undefined>(undefined);
    const [longitude, setLongitude] = React.useState<number | undefined>(undefined);
    const [showMap, setShowMap] = React.useState(false);



    const saveContact = async () => {
        try {

            const validateEmail = (mail:string) => {
                // Expresión regular para validar formato de email
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(mail);
              };

            if (!fullname){
                Alert.alert('Error','Please input a Name');
                return;
            }

            if (!phone){
                Alert.alert('Error','Please input a Phone Number');
                return;
            }

            if (!validateEmail(email)) {
                Alert.alert('Error', 'Please input a valid email');
                return;
            }

            const updatedContact: Item = {
                id: contact.id,
                fullname,
                phone,
                email,
                photo,
                latitude,
                longitude,
            };

            const contactId = `contact_${updatedContact.id}`;
            await AsyncStorage.setItem(contactId, JSON.stringify(updatedContact));
            Alert.alert('Success', 'Contact updated successfully.');
             // Navega de vuelta a la pantalla de inicio
            navigation.navigate('Home');

        } catch (error) {
            console.error('Error updating contact:', error);
            Alert.alert('Error', 'Failed to update contact.');
        }
    };

    const choosePhoto = async () => {
        const response = await launchImageLibrary({ mediaType: 'photo' });
        if (response.assets && response.assets.length > 0) {
            const uri = response.assets[0].uri;
            if (uri) {
                setPhoto(uri);
            }
        }
    };

    const takePhoto = async () => {
        const hasPermission = await checkOrRequestCameraPermission(setPhoto);
        if (!hasPermission) {
            Alert.alert('Permission Required', 'Camera permission is needed to take a photo.');
            return;
        }


        const response = await launchCamera({ mediaType: 'photo' });
        if (response.assets && response.assets.length > 0) {
            const uri = response.assets[0].uri;
            if (uri) {
                setPhoto(uri);
            }
        }
    };
    const handleSaveCoordinates = (lat: number, lon: number) => {
        setLatitude(lat);
        setLongitude(lon);
        setShowMap(false);
        Alert.alert(`Coordinates Saved', Lat: ${lat}, Lon: ${lon}`);
    };


    return (
        <SafeAreaProvider style={styles.generalView}>
            <SafeAreaView>
                <ScrollView>
                    <View>
                        <Text style={styles.title}>Edit Contact</Text>
                        <View style={styles.photoContainer}>
                            {photo ? (
                                <Image style={styles.photo} source={{ uri: photo }} />
                            ) : (
                                <Icon name="account-circle" size={150} />
                            )}
                        </View>
                        <TouchableOpacity style={styles.button} onPress={choosePhoto}>
                            <Icon.Button style={styles.IconButton} name="add-photo-alternate" size={35} onPress={choosePhoto}>
                                Choose from Gallery
                            </Icon.Button>
                        </TouchableOpacity>
                        <View style={styles.button}>
                            <TouchableOpacity>
                                <Icon.Button style={styles.IconButton} name="add-a-photo" size={30} onPress={takePhoto}>
                                    Take Photo
                                </Icon.Button>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View>
                        <TouchableOpacity style={styles.button} >
                            <Icon.Button style={styles.IconButton} name="map" size={30} onPress={() => setShowMap(true)}> Open Map</Icon.Button>
                        </TouchableOpacity>
                        <TextInput
                            style={styles.input}
                            onChangeText={setFullName}
                            value={fullname}
                            placeholder="Fullname"
                            placeholderTextColor="#f8f8ff"
                        />
                        <TextInput
                            style={styles.input}
                            onChangeText={setPhone}
                            value={phone}
                            placeholder="Phone"
                            placeholderTextColor="#f8f8ff"
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={styles.input}
                            onChangeText={setEmail}
                            value={email}
                            placeholder="Email"
                            placeholderTextColor="#f8f8ff"
                        />
                        <View style={[styles.location, styles.centerContent]}>
                            <Text style={styles.centerText}>
                                <Icon name="location-pin" size={30} style={styles.icon} />
                                {contact.latitude}, {contact.longitude}
                                {latitude !== undefined && longitude !== undefined
                                    ? `Lat: ${latitude.toFixed(6)}, Lon: ${longitude.toFixed(6)}`
                                    : ''}
                            </Text>
                        </View>
                    </View>
                    <View>
                        <TouchableOpacity style={styles.touchable} onPress={saveContact}>
                            <View style={styles.save}>
                                <Icon name="check" size={80} color="#f8f8ff" />
                            </View>
                        </TouchableOpacity>
                        <MapPage
                            visible={showMap}
                            onClose={() => setShowMap(false)}
                            onSaveCoordinates={handleSaveCoordinates}
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    generalView: {
        backgroundColor: '#00bfff',
    },
    input: {
        height: 50,
        margin: 12,
        borderWidth: 3,
        padding: 10,
        color: '#f8f8ff',
        borderColor: '#f8f8ff',
        fontSize: 25,
        borderRadius: 15,
    },
    title: {
        fontSize: 50,
        color: '#f8f8ff',
        textAlign: 'center',
        margin: 50,
        fontWeight: '600',
    },
    save: {
        padding: 8,
        color: '#f8f8ff',
        fontSize: 25,
        borderRadius: 25,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontWeight: '700',
    },
    touchable: {
        marginTop: 30,
        alignItems: 'center',
    },
    photoContainer: {
        width: 150,
        height: 150,
        borderRadius: 75,
        alignSelf: 'center',
        overflow: 'hidden',
        backgroundColor: '#ebebfe',
        marginBottom: 20,
    },
    photo: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    IconButton: {
        color: '#f8f8ff',
        fontWeight: '600',
        backgroundColor: '#312bf9',
    },
    button: {
        backgroundColor: '#312bf9',
        padding: 10,
        borderRadius: 10,
        marginVertical: 5,
        alignItems: 'center',
        height: 70,
        width: 200,
        alignSelf: 'center',
    },
    info: {
        fontSize: 20,
        marginBottom: 10,
        color: '#f0f8ff',
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 12,
        alignSelf: 'center',

    },
    location: {
        marginTop: 10,
    },
    centerContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    centerText: {
        textAlign: 'center',
        color:'#f0f8ff',
        fontSize:20,
    },
});


export default EditContact;
