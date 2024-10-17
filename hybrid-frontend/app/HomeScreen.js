import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Button mode="contained" onPress={() => alert('Cervezas')} style={styles.button}>
        Cervezas
      </Button>
      <Button mode="contained" onPress={() => alert('Bares')} style={styles.button}>
        Bares
      </Button>
      <Button mode="contained" onPress={() => alert('Eventos')} style={styles.button}>
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