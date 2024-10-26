import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
// import { useNavigation } from '@react-navigation/native'; // Importa el hook
import {useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';


// El componente funcional MainIndex
export default function MainIndex() {
  const router = useRouter()
  // const navigation = useNavigation(); // Usa el hook para obtener el objeto de navegación

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('@user_id');
      console.log('user_id borrado exitosamente');
    } catch (error) {
      console.error('Error al borrar user_id:', error);
    }
  }


  return (
    <View style={styles.container}>
      <Button mode="contained" onPress={() => router.push('/loginScreen')}>
        Login
      </Button>
      <Button mode="contained" onPress={() => router.push('/beers')}>
        Cervezas
      </Button>
      <Button mode="contained" onPress={handleLogout}>
        Logout
      </Button>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
});
