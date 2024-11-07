import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Item } from '../types/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import {EditDetailsNavigation} from '../../types/navigationTypes';

type EditContactRouteProp = RouteProp<{ params: { contact: Item } }, 'params'>;

export const EditContact: React.FC = () => {
    const route = useRoute<EditContactRouteProp>();
    const navigation = useNavigation<EditDetailsNavigation>();
    const { contact } = route.params;

    const [fullname, setFullName] = useState(contact.fullname);
    const [phone, setPhone] = useState(contact.phone);
    const [email, setEmail] = useState(contact.email);
    const [address, setAddress] = useState(contact.address);
    const [photo, setPhoto] = useState(contact.photo);

    const saveContact = async () => {
        try {
            const updatedContact: Item = {
                id: contact.id,
                fullname,
                phone,
                email,
                address,
                photo,
            };

            const contactId = `contact_${updatedContact.id}`;
            await AsyncStorage.setItem(contactId, JSON.stringify(updatedContact));
            Alert.alert('Success', 'Contact updated successfully.');

        } catch (error) {
            console.error('Error updating contact:', error);
            Alert.alert('Error', 'Failed to update contact.');
        } finally{
            navigation.navigate('Home');// Navega de vuelta a la pantalla de inicio
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
        const response = await launchCamera({ mediaType: 'photo' });
        if (response.assets && response.assets.length > 0) {
            const uri = response.assets[0].uri;
            if (uri) {
                setPhoto(uri);
            }
        }
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
                        <TextInput
                            style={styles.input}
                            onChangeText={setAddress}
                            value={address}
                            placeholder="Address"
                            placeholderTextColor="#f8f8ff"
                        />
                    </View>
                    <View>
                        <TouchableOpacity style={styles.touchable} onPress={saveContact}>
                            <View style={styles.save}>
                                <Icon name="check" size={80} color="#f8f8ff" />
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
});

export default EditContact;
