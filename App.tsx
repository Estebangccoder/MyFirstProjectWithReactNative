// // App.tsx
// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import Home from './src/screens/Home';
// import DetailItem from './src/screens/contactDetails';
// import { Item } from './src/types'; // Importa el tipo de `Item` donde lo tengas definido

// // Define el tipo RootStackParamList dentro de App.tsx
// type RootStackParamList = {
//   Home: undefined;
//   DetailItem: { item: Item }; // Define que DetailItem espera un parámetro 'item' de tipo Item
// };

// const Stack = createNativeStackNavigator<RootStackParamList>();

// const App = () => (
//   <NavigationContainer>
//     <Stack.Navigator initialRouteName="Home">
//       <Stack.Screen name="Home" component={Home} />
//       <Stack.Screen name="DetailItem" component={DetailItem} />
//     </Stack.Navigator>
//   </NavigationContainer>
// );

// export default App;



import React from 'react';
//import React, { useState, useEffect } from 'react';
//import { View, Text, FlatList, Button, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import  {List}  from './src/screens/main';
import {ContactCreate} from './src/screens/addContact';
import {ContactDetails} from './src/screens/contactDetails';
import {EditContact} from './src/screens/editContact';


const Stack = createNativeStackNavigator();

export const App = () => {
  return (
<NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={List}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Create" component={ContactCreate} options={{headerShown: false}}/>
        <Stack.Screen name="ContactDetails" component={ContactDetails} options={{headerShown: false}}/>
        <Stack.Screen name="EditContact" component={EditContact} options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>

  //  <List/>
 //<ContactCreate/>

   );
};

// const styles = StyleSheet.create({
//   container:{
//     justifyContent:'center',

//   },

//   bigBlue: {
//     color: 'blue',
//     fontWeight: 'bold',
//     fontSize: 30,
//   },
// });
