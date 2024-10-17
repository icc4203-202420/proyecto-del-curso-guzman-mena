import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

export default function MainIndex({ navigation }) {
  return (
    <View style={styles.container}>
      <Button mode="contained" onPress={() => navigation.navigate('Beers')}>
        Cervezas
      </Button>
      <Button mode="contained" onPress={() => navigation.navigate('Bars')}>
        Bares
      </Button>
      <Button mode="contained" onPress={() => navigation.navigate('Events')}>
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
    gap: 20,
  },
});
