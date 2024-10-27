import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export const App = () => {
  return (
    <SafeAreaView style={styles.container}>
    <View>
       <Text><Contacs></Contacs></Text>
    </View>
    </SafeAreaView>
   );
};

const styles = StyleSheet.create({
  container:{
    justifyContent:'center',

  },
});
