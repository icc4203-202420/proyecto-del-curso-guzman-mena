import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Link href="/beer" asChild>
        <Button mode="contained" style={styles.button}>
          Cervezas
        </Button>
      </Link>
      <Button 
        mode="contained" 
        onPress={() => alert('Bares')} 
        style={styles.button}
      >
        Bares
      </Button>
      <Button 
        mode="contained" 
        onPress={() => alert('Eventos')} 
        style={styles.button}
      >
        Eventos
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  button: {
    width: 200,
    margin: 10,
  },
});