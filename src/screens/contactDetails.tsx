import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, Modal, Alert, Button } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Item } from '../types/index';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HomeNavigation } from '../../types/navigationTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ContactDetailsRouteProp = RouteProp<{ params: { contact: Item } }, 'params'>;

export const ContactDetails: React.FC = () => {
    const route = useRoute<ContactDetailsRouteProp>();
    const { contact } = route.params;
    const navigation = useNavigation<HomeNavigation>();
     // Estado para el modal de confirmación
     const [modalVisible, setModalVisible] = useState(false);

     // Función para eliminar el contacto de AsyncStorage
     const deleteContact = async () => {
         try {
             const contactId = `contact_${contact.id}`;
             await AsyncStorage.removeItem(contactId);
             Alert.alert('Deleted', 'The contact has been deleted.');
             navigation.navigate('Home'); // Vuelve a la pantalla de inicio después de eliminar
         } catch (error) {
             console.error('Error deleting contact:', error);
             Alert.alert('Error', 'Failed to delete contact.');
         }
     };
     const handleEditItem = () => {
        navigation.navigate('EditContact', {contact});
      };

    return (<SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.card}>
            <Image source={{ uri: contact.photo }} style={styles.photo} />
            <Text style={styles.name}>{contact.fullname}</Text>
            <Text style={styles.info}><Icon name="call" size={28} style={styles.icon}/> {contact.phone}</Text>
            <Text style={styles.info}><Icon name="email" size={28} style={styles.icon} /> {contact.email}</Text>
            <Text style={styles.info}><Icon name="location-pin" size={28} style={styles.icon}/>{contact.address}</Text>
        </View>

        <TouchableOpacity style={styles.edit} >
          <Icon name="edit" size={55} color="#f8f8ff" onPress={() => handleEditItem()} style={styles.iconStyle} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.add} >
          <Icon name="delete" size={55} color="#f8f8ff" onPress={() => setModalVisible(true)} style={styles.iconStyle}  />
        </TouchableOpacity>
  {/* Modal de confirmación */}
  <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Are you sure you want to delete this contact?</Text>
                            <View style={styles.modalButtons}>
                                <Button
                                    title="Cancel"
                                    onPress={() => setModalVisible(false)}
                                    color="#00bfff"
                                />
                                <Button
                                    title="Delete"
                                    onPress={() => {
                                        setModalVisible(false);
                                        deleteContact();
                                    }}
                                    color="#ff4d4d"
                                />
                                             </View>
                        </View>
                    </View>
                </Modal>
        </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#00bfff',
    },
    photo: {
        width: 250,
        height: 250,
        borderRadius: 120,
        marginBottom: 20,
    },
    name: {
        fontSize: 36,
        fontWeight: '900',
        marginBottom: 10,
        color: '#f0f8ff',
    },
    info: {
        fontSize: 20,
        marginBottom: 10,
        color: '#f0f8ff',
        flexDirection: 'row',
        alignItems: 'center',
     },
    add: {
        position: 'absolute',
        bottom: 20,
        left: 220,
        width: 60,
        height: 60,
        borderRadius: 90,
        elevation: 5,
        backgroundColor:'#00bfff',
        shadowColor: '#312bf9',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3.5,
      },
      edit :{
        position: 'absolute',
        bottom: 20,
        left: 100,
        width: 60,
        height: 60,
        borderRadius: 90,
        borderColor:'#312bf9',
        elevation: 5,
        backgroundColor:'#00bfff',
        shadowColor: '#312bf9',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3.5,
      },
      iconStyle: {
        alignSelf: 'center',  // Asegura que el icono esté centrado
      },
      card:{
        flex: 1,
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#00bfff',
        borderRadius:20,
      },
      icon:{
        marginRight:12,
        alignSelf:'center',

    },   modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: 300,
        backgroundColor: '#ebebfe',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#312bf9',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 10,
        textAlign: 'center',
        fontSize: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
});

