import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import {useRouter } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons';
import { saveItem, getItem, deleteItem } from "../util/Storage";




// El componente funcional MainIndex
export default function MainIndex() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      
      await deleteItem('userId');
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
      <Button mode="contained" onPress={() => router.push('/profile')}>
        Perfil
      </Button>
      <Button mode="contained" onPress={() => router.push('/beers')}>
        Cervezas
      </Button>
      <Button mode="contained" onPress={() => router.push('/bars')}>
        Bares
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
