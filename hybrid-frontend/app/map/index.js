import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Card, Title, Paragraph } from 'react-native-paper';

export default function MapIndex() {
  // Example location data
  const locations = [
    { id: 1, title: 'Bar A', address: 'Calle 1, Ciudad' },
    { id: 2, title: 'Bar B', address: 'Calle 2, Ciudad' },
    { id: 3, title: 'Bar C', address: 'Calle 3, Ciudad' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mapa de Bares</Text>
      <View style={styles.mapPlaceholder}>
        <Text>Mapa no disponible en este momento</Text>
      </View>
      {locations.map((location) => (
        <Card key={location.id} style={styles.card}>
          <Card.Content>
            <Title>{location.title}</Title>
            <Paragraph>{location.address}</Paragraph>
          </Card.Content>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  card: {
    marginBottom: 10,
  },
});