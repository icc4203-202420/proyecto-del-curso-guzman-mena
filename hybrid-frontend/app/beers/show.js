import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Card, Title, Paragraph } from 'react-native-paper';

// Datos de ejemplo
const exampleBeers = {
  '1': { id: '1', name: 'IPA Artesanal', brewery: 'Cervecería A', description: 'Una IPA con notas cítricas y un amargor equilibrado.', image: 'https://example.com/ipa.jpg' },
  '2': { id: '2', name: 'Stout Imperial', brewery: 'Cervecería B', description: 'Una stout robusta con sabores a café y chocolate.', image: 'https://example.com/stout.jpg' },
  '3': { id: '3', name: 'Lager Clásica', brewery: 'Cervecería C', description: 'Una lager refrescante y fácil de beber.', image: 'https://example.com/lager.jpg' },
  '4': { id: '4', name: 'Pale Ale', brewery: 'Cervecería D', description: 'Una pale ale con un perfil maltoso y un toque de lúpulo.', image: 'https://example.com/pale-ale.jpg' },
};

export default function BeersShow({ route }) {
  const { id } = route.params;
  const beer = exampleBeers[id];

  if (!beer) return <Text>Cerveza no encontrada</Text>;

  return (
    <View style={styles.container}>
      <Card>
        <Card.Content>
          <Title>{beer.name}</Title>
          <Paragraph>{beer.brewery}</Paragraph>
        </Card.Content>
        <Card.Cover source={{ uri: beer.image }} />
        <Card.Content>
          <Paragraph>{beer.description}</Paragraph>
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
});