import React from 'react';
import { StyleSheet, TextInput, Text, View, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Item } from '../types/index';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { CreateNavigation } from '../../types/navigationTypes';
import MapPage from '../components/mapPage';
import { checkOrRequestCameraPermission, checkOrRequestGalleryPermissions } from '../types/checkPermission';
import WeatherModal from '../components/weatherModal';
import { fetchWeatherData } from '../types/weatherService';


export const ContactCreate = () => {

    const [weatherData, setWeatherData] = React.useState<any>(null);
    const [showWeatherModal, setShowWeatherModal] = React.useState(false);
    const navigation = useNavigation<CreateNavigation>();
    const [fullname, onChangeFullName] = React.useState('');
    const [phone, onChangePhone] = React.useState('');
    const [email, onChangeEmail] = React.useState('');
    const [photo, onChangePhoto] = React.useState<string | undefined>(undefined);
    const [latitude, setLatitude] = React.useState<number | undefined>(undefined);
    const [longitude, setLongitude] = React.useState<number | undefined>(undefined);
    const [showMap, setShowMap] = React.useState(false);

    const TakePhoto = async () => {
        const hasPermission = await checkOrRequestCameraPermission(onChangePhoto);
        if (!hasPermission) {
            Alert.alert('Permission Required', 'Camera permission is needed to take a photo.');
            return;
        }

        const response = await launchCamera({ mediaType: 'photo' });
        if (response.assets && response.assets.length > 0) {
            const uri = response.assets[0].uri;
            if (uri) {
                onChangePhoto(uri);
            }
        }
    };

    const ChoosePhoto = async () => {

        const hasPermission = await checkOrRequestGalleryPermissions(onChangePhoto);
        if (!hasPermission) {
            Alert.alert('Permission Required', 'Storage permission is needed to access the gallery.');
            return;
        }


        const response = await launchImageLibrary({ mediaType: 'photo' });
        if (response.assets && response.assets.length > 0) {
            const uri = response.assets[0].uri;
            if (uri) {
                onChangePhoto(uri);
            }
        }
    };

    const handleSaveCoordinates = async (lat: number, lon: number) => {
        console.log('handleSaveCoordinates called with:', lat, lon);
        setLatitude(lat);
        setLongitude(lon);
        setShowMap(false);
        //Alert.alert(`Coordinates Saved', Lat: ${lat}, Lon: ${lon}`);
        try {
            console.log('About to call fetchWeatherData');
            const data = await fetchWeatherData(lat, lon);
            console.log('Weather data:', data); // Añade este log para depurar
            setWeatherData(data);
            setShowWeatherModal(true);
        } catch {
           Alert.alert('Error', 'Failed to fetch weather data');
        }
    };

    const validateEmail = (mail: string) => {
        // Expresión regular para validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(mail);
    };


    const SaveContact = async () => {
        try {

            if (!fullname) {
                Alert.alert('Error', 'Please input a Name');
                return;
            }

            if (!phone) {
                Alert.alert('Error', 'Please input a Phone Number');
                return;
            }

            if (!validateEmail(email)) {
                Alert.alert('Error', 'Please input a valid email');
                return;
            }

            // Obtén el último ID almacenado y conviértelo a un número
            const lastId = await AsyncStorage.getItem('lastId');
            const newId = lastId ? parseInt(lastId, 10) + 1 : 1;


            // Crea un objeto que cumpla con la interfaz Item
            const contact: Item = {
                id: newId,
                fullname,
                phone,
                email,
                latitude,
                longitude,
                photo,
            };


            await AsyncStorage.setItem('lastId', newId.toString());

            // Guarda el contacto en AsyncStorage como una cadena JSON
            const contactId = `contact_${contact.id}`;
            await AsyncStorage.setItem(contactId, JSON.stringify(contact));

            Alert.alert('Success', 'Contact saved successfully');
            console.log('Contact saved:', contact);

            // Navega de vuelta a la pantalla de inicio
            navigation.navigate('Home');

        } catch (error) {
            console.error('Error saving contact to local storage:', error);
            Alert.alert('Error', 'Failed to save contact');
        }
    };
    return (
        <SafeAreaProvider style={styles.generalView}>
            <SafeAreaView >
                <ScrollView>
                    <View>
                        <Text style={styles.title}>New Contact</Text>
                        <View style={styles.photoContainer}>
                            {photo ?
                                <Image style={styles.photo} source={{ uri: photo }} />
                                :
                                <Icons name="account-circle" size={150} />}


                        </View>
                        <TouchableOpacity style={styles.button} onPress={ChoosePhoto}>
                            <Icons.Button style={styles.IconButton} name="add-photo-alternate" size={35} onPress={ChoosePhoto}>Choose from Gallery</Icons.Button>
                        </TouchableOpacity>
                        <View style={styles.button}>
                            <TouchableOpacity >
                                <Icons.Button style={styles.IconButton} name="add-a-photo" size={30} onPress={TakePhoto}> Take Photo</Icons.Button>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TouchableOpacity style={styles.button} >
                                <Icons.Button style={styles.IconButton} name="map" size={30} onPress={() => setShowMap(true)}> Open Map</Icons.Button>
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            style={styles.input}
                            onChangeText={onChangeFullName}
                            value={fullname}
                            placeholder="Fullname"
                            placeholderTextColor="#f8f8ff"
                        />
                        <TextInput
                            style={styles.input}
                            onChangeText={onChangePhone}
                            value={phone}
                            placeholder="Phone"
                            placeholderTextColor="#f8f8ff"
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={styles.input}
                            onChangeText={onChangeEmail}
                            value={email}
                            placeholder="Email"
                            placeholderTextColor="#f8f8ff"
                        />
                        {/* <Text>`{setLatitude},{setLongitude}`</Text> */}


                    </View>
                    <View>
                        <TouchableOpacity style={styles.touchable} onPress={SaveContact}>
                            <View style={styles.save}>
                                <Icons name="add-circle" size={80} color="#f8f8ff" />
                            </View>
                        </TouchableOpacity>
                        <WeatherModal
                            visible={showWeatherModal}
                            onClose={() => setShowWeatherModal(false)}
                            weatherData={weatherData}
                        />
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
        overflow: 'hidden', // Recorta la imagen al borde circular
        backgroundColor: '#ebebfe', // Color de fondo si la imagen no se carga
        marginBottom: 20,
    },
    photo: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover', // Ajusta la imagen para cubrir completamente el contenedor
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
});

