import React from 'react';
import {View, FlatList, StyleSheet, Text, StatusBar} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import {data} from '../data/data';

type ItemProps = {
    fullname: string,
    phone:string,
    email:string,
};

const Item = ({fullname, phone, email}: ItemProps) => (
  <View style={styles.item}>
    <Text style={styles.fullname}>{fullname}</Text>
    <Text style={styles.info}>{phone}</Text>
    <Text style={styles.info}>{email}</Text>
  </View>
);

export const List = () => (
  <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        renderItem={({item}) => <Item fullname={item.fullName} phone={item.phone} email={item.email} />
    }
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  </SafeAreaProvider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#00bfff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius:30,
    overflow:'hidden',
  },
  fullname: {
    fontSize: 32,
    color:'#f0f8ff',
  },
  info: {
    fontSize: 16,
    color: '#f8f8ff',
  },
});

