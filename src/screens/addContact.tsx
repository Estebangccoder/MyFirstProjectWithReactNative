import React from 'react';
import { StyleSheet, TextInput, Text, View, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Item} from '../types/index';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { CreateNavigation } from '../../types/navigationTypes';




export const ContactCreate = () => {

    const navigation = useNavigation<CreateNavigation>();
    const [fullname, onChangeFullName] = React.useState('');
    const [phone, onChangePhone] = React.useState('');
    const [email, onChangeEmail] = React.useState('');
    const [address, onChangeAddress] = React.useState('');
    const [photo, onChangePhoto] =  React.useState<string | undefined>(undefined);

    const TakePhoto = async () => {
        const response = await launchCamera({ mediaType: 'photo' });
        if (response.assets && response.assets.length > 0) {
            const uri = response.assets[0].uri;
            if (uri) {
                onChangePhoto(uri);
            }
        }
    };

    const ChoosePhoto = async () => {
        const response = await launchImageLibrary({ mediaType: 'photo' });
        if (response.assets && response.assets.length > 0) {
            const uri = response.assets[0].uri;
            if (uri) {
                onChangePhoto(uri);
            }
        }
    };

    const SaveContact = async () => {
        try {
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
            altitude
            photo,
        };



             // Guarda el nuevo ID como el último ID en AsyncStorage
        await AsyncStorage.setItem('lastId', newId.toString());


            // Guarda el contacto en AsyncStorage como una cadena JSON
            const contactId = `contact_${contact.id}`;
            await AsyncStorage.setItem(contactId, JSON.stringify(contact));
            Alert.alert('Success', 'Contact saved successfully');
            console.log('Contact saved:', contact);
        } catch (error) {
            console.error('Error saving contact to local storage:', error);
            Alert.alert('Error', 'Failed to save contact');
        } finally{
            navigation.navigate('Home');

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
                                <Image style={styles.photo} source={{uri:photo}} />
                                :
                                 <Icons name="account-circle" size={150}/> }


                        </View>
                        <TouchableOpacity style={styles.button} onPress={ChoosePhoto}>
                         <Icons.Button style={styles.IconButton} name="add-photo-alternate" size={35} onPress={ChoosePhoto}>Choose from Gallery</Icons.Button>
                        </TouchableOpacity>
                        <View style={styles.button}>
                        <TouchableOpacity >
                            <Icons.Button style={styles.IconButton} name="add-a-photo" size={30}  onPress={TakePhoto}> Take Photo</Icons.Button>
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
                        <TextInput
                            style={styles.input}
                            onChangeText={onChangeAddress}
                            value={address}
                            placeholder="Dirección"
                            placeholderTextColor="#f8f8ff"
                        />

                    </View>
                    <View>
                        <TouchableOpacity style={styles.touchable} onPress={SaveContact}>
                            <View style={styles.save}>
                                <Icons name="add-circle" size={80} color="#f8f8ff"/>
                            </View>
                        </TouchableOpacity>
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
        fontWeight:'600',

    },

    save: {
        padding: 8,
        color: '#f8f8ff',
        fontSize: 25,
        borderRadius: 25,
        textAlign: 'center',
        textAlignVertical:'center',
        fontWeight:'700',
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
        height:70,
        width:200,
        alignSelf:'center',

    },
});
