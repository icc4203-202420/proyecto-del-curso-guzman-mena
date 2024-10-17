import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Avatar, List } from 'react-native-paper';

export default function ProfileIndex() {
  // Ejemplo de datos de usuario
  const user = {
    name: 'Juan Pérez',
    email: 'juan@example.com',
    favoriteBeers: ['IPA', 'Stout', 'Lager'],
    favoriteBars: ['Bar A', 'Bar B', 'Bar C'],
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Avatar.Text size={80} label={user.name[0]} />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>
      <List.Section>
        <List.Subheader>Cervezas favoritas</List.Subheader>
        {user.favoriteBeers.map((beer, index) => (
          <List.Item key={index} title={beer} left={() => <List.Icon icon="beer" />} />
        ))}
      </List.Section>
      <List.Section>
        <List.Subheader>Bares favoritos</List.Subheader>
        {user.favoriteBars.map((bar, index) => (
          <List.Item key={index} title={bar} left={() => <List.Icon icon="glass-mug-variant" />} />
        ))}
      </List.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
});