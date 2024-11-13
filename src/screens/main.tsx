import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, StatusBar, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { HomeNavigation } from '../../types/navigationTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ItemProps = {
  id: number;
  fullname: string;
  phone: string;
  email: string;
  photo: string;
  latitude: number;
  longitude: number;
};

const ItemComponent = ({ fullname, phone, email, photo }: ItemProps) => (
  <View style={styles.contact}>
    <View>
      <Image
        source={{ uri: photo }}
        style={styles.photo}
      />
    </View>
    <View>
      <Text style={styles.fullname}>{fullname}</Text>
      <Text style={styles.info}>{phone}</Text>
      <Text style={styles.info}>{email}</Text>
    </View>
  </View>
);

export const List = () => {
  const navigation = useNavigation<HomeNavigation>();
  const [contacts, setContacts] = useState<ItemProps[]>([]);

  useEffect(() => {
    const loadContacts = async () => {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const contactKeys = keys.filter(key => key.startsWith('contact_')); // Filtra solo las claves de los contactos

            const contactItems = await AsyncStorage.multiGet(contactKeys);
            const loadedContacts = contactItems.map(([key, value]) => {
                try {
                    return value ? JSON.parse(value) as ItemProps : null;
                } catch (e) {
                    console.error('Error parsing contact:', key, e);
                    return null;
                }
            }).filter(contact => contact !== null) as ItemProps[];

            setContacts(loadedContacts);
            console.log('Loaded contacts:', loadedContacts); // Verifica si se cargan todos los contactos
        } catch (error) {
            console.error('Error loading contacts:', error);
        }
    };

    loadContacts();
// Agregar un listener para recargar los contactos al volver a la pantalla de Home
const unsubscribe = navigation.addListener('focus', () => {
  loadContacts();
});

return unsubscribe;
}, [navigation]);

  const handleAddItem = () => {
    navigation.navigate('Create');
  };


  const handleViewContact = (contact: ItemProps) => {
    navigation.navigate('ContactDetails', { contact });
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={contacts}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() =>handleViewContact(item)}>
              <ItemComponent photo={item.photo} fullname={item.fullname} phone={item.phone} email={item.email} id={item.id} latitude={item.latitude} longitude={item.longitude} />
            </TouchableOpacity>
          )}
        />

        <View>
          <TouchableOpacity style={styles.add} onPress={handleAddItem}>
            <Icon name="add-circle" size={80} color="#f8f8ff" style={styles.iconStyle}/>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  contact: {
    backgroundColor: '#00bfff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 30,
    flexDirection: 'row',
    flex: 1,
  },
  fullname: {
    fontSize: 22,
    color: '#f0f8ff',
    fontWeight: '900',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  info: {
    fontSize: 16,
    color: '#f8f8ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  photo: {
    flex: 1,
    width: 100,
    height: 100,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  add: {
    position: 'absolute',
    bottom: 20,
    left: 300,
    width: 80,
    height: 80,
    borderRadius: 90,
    elevation: 5,
    backgroundColor:'#00bfff',
    shadowColor: '#312bf9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.5,
  },
  address:{
    display:'none',
  },
  iconStyle: {
    alignSelf: 'center',
  },
});
