import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

export default function MainIndex({ navigation }) {
  return (
    <View style={styles.container}>
      <Button mode="contained" onPress={() => navigation.navigate('Beers')} style={styles.button}>
        Cervezas
      </Button>
      <Button mode="contained" onPress={() => navigation.navigate('Bars')} style={styles.button}>
        Bares
      </Button>
      <Button mode="contained" onPress={() => navigation.navigate('Events')} style={styles.button}>
        Eventos
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    marginVertical: 10,
    width: '100%',
  },
});