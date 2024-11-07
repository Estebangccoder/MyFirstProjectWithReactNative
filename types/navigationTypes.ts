import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Item } from '../src/types/index'; // Asegúrate de importar la interfaz Item si la vas a usar como tipo


export type RootStackParamList={
  Home:undefined;
  Create:undefined;
  ContactDetails: { contact: Item }; // Agrega ContactDetails y pasa un contacto como parámetro
  EditContact:{ contact: Item };

}

export type HomeNavigation = NativeStackNavigationProp<RootStackParamList, 'Home'>

export type CreateNavigation = NativeStackNavigationProp<RootStackParamList, 'Create'>

export type ContactDetailsNavigation = NativeStackNavigationProp<RootStackParamList, 'ContactDetails'>;

export type EditDetailsNavigation = NativeStackNavigationProp<RootStackParamList, 'EditContact'>;
