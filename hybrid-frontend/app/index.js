import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
// import { useNavigation } from '@react-navigation/native'; // Importa el hook
import {useRouter } from 'expo-router'


// El componente funcional MainIndex
export default function MainIndex() {
  const router = useRouter()
  // const navigation = useNavigation(); // Usa el hook para obtener el objeto de navegación

  return (
    <View style={styles.container}>
      <Button mode="contained" onPress={() => router.push('/loginScreen')}>
        Login
      </Button>
      <Button mode="contained" onPress={() => router.push('/beers')}>
        Cervezas
      </Button>
      {/* <Button mode="contained" onPress={() => navigation.navigate('Bars')}>
        Bares
      </Button>
      <Button mode="contained" onPress={() => navigation.navigate('Events')}>
        Eventos
      </Button> */}
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
