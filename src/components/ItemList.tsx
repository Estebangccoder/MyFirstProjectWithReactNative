import React from 'react';
import { View, Text, Image, StyleSheet, StatusBar } from 'react-native';
import { Item } from '../types';

interface ItemCardProps {
  item: Item;
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => (
    <View style={styles.contact}>
    <View>
     <Image source={{
             uri: item.photo,
           }}
           style={styles.photo}/>


     </View>
   <View>
   <Text style={styles.fullname}>{item.fullname}</Text>
   <Text style={styles.info}>{item.phone}</Text>
   <Text style={styles.info}>{item.email}</Text>
   </View>
 </View>
);

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
      borderRadius:30,
      flexDirection:'row',
      flex: 1,
      //overflow:'hidden',
      //alignItems:'flex-end',
    },
    fullname: {
      fontSize: 22,
      color:'#f0f8ff',
      fontWeight:'900',
      alignItems:'center',
      justifyContent: 'center',
      marginHorizontal: 16,
    },
    info: {
      fontSize: 16,
      color: '#f8f8ff',
      alignItems:'center',
      justifyContent: 'center',
      marginHorizontal: 16,
    },
    photo:{
      flex:1,
      width:100,
      height: 100,
      borderRadius:10,
      alignItems:'center',
      justifyContent: 'center',
      marginHorizontal: 16,
     },
  });

export default ItemCard;
