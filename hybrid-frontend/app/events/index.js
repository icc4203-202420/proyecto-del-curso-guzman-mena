import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Searchbar, List } from 'react-native-paper';

export default function EventsIndex({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');

  // Ejemplo de datos de eventos
  const events = [
    { id: '1', name: 'Festival de Cerveza', date: '2023-07-15', location: 'Parque Central' },
    { id: '2', name: 'Cata de Cervezas Artesanales', date: '2023-07-22', location: 'Bar A' },
    { id: '3', name: 'Oktoberfest', date: '2023-10-01', location: 'Plaza Mayor' },
    { id: '4', name: 'Curso de Elaboración de Cerveza', date: '2023-08-05', location: 'Cervecería Local' },
  ];

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Buscar eventos"
        onChangeText={setSearchQuery}
        value={searchQuery}
      />
      <FlatList
        data={filteredEvents}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <List.Item
            title={item.name}
            description={`${item.date} - ${item.location}`}
            onPress={() => navigation.navigate('EventsShow', { id: item.id })}
            left={props => <List.Icon {...props} icon="calendar" />}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});