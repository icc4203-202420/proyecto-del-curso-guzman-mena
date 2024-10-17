import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Card, Title, Paragraph, Button } from 'react-native-paper';

export default function EventsShow({ route }) {
  const { id } = route.params;

  // Ejemplo de datos de un evento
  const event = {
    id: id,
    name: 'Festival de Cerveza',
    date: '2023-07-15',
    location: 'Parque Central',
    description: 'Un festival con más de 50 cervezas artesanales de todo el país.',
    image: 'https://example.com/beer-festival-image.jpg',
    price: '$10',
  };

  return (
    <View style={styles.container}>
      <Card>
        <Card.Content>
          <Title>{event.name}</Title>
          <Paragraph>{event.date} - {event.location}</Paragraph>
        </Card.Content>
        <Card.Cover source={{ uri: event.image }} />
        <Card.Content>
          <Paragraph>{event.description}</Paragraph>
          <Text style={styles.price}>Precio: {event.price}</Text>
        </Card.Content>
        <Card.Actions>
          <Button onPress={() => console.log('Comprar entrada')}>Comprar Entrada</Button>
        </Card.Actions>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  price: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: 'bold',
  },
});