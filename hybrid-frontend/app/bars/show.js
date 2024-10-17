import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Card, Title, Paragraph } from 'react-native-paper';

export default function BarsShow({ route }) {
  const { id } = route.params;

  // Ejemplo de datos de un bar
  const bar = {
    id: id,
    name: 'Bar A',
    address: 'Calle 1, Ciudad',
    description: 'Un bar acogedor con una gran selección de cervezas artesanales.',
    image: 'https://example.com/bar-a-image.jpg',
    beers: ['IPA', 'Stout', 'Lager'],
  };

  return (
    <View style={styles.container}>
      <Card>
        <Card.Content>
          <Title>{bar.name}</Title>
          <Paragraph>{bar.address}</Paragraph>
        </Card.Content>
        <Card.Cover source={{ uri: bar.image }} />
        <Card.Content>
          <Paragraph>{bar.description}</Paragraph>
          <Title style={styles.beersTitle}>Cervezas disponibles:</Title>
          {bar.beers.map((beer, index) => (
            <Text key={index}>{beer}</Text>
          ))}
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  beersTitle: {
    marginTop: 16,
    fontSize: 18,
  },
});