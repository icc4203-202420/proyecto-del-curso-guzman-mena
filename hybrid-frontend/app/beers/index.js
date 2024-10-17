import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Searchbar, List } from 'react-native-paper';

// Datos de ejemplo
const exampleBeers = [
  { id: '1', name: 'IPA Artesanal', brewery: 'Cervecería A' },
  { id: '2', name: 'Stout Imperial', brewery: 'Cervecería B' },
  { id: '3', name: 'Lager Clásica', brewery: 'Cervecería C' },
  { id: '4', name: 'Pale Ale', brewery: 'Cervecería D' },
];

export default function BeersIndex({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [beers, setBeers] = useState(exampleBeers);

  const filteredBeers = beers.filter(beer =>
    beer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Buscar cervezas"
        onChangeText={setSearchQuery}
        value={searchQuery}
      />
      <FlatList
        data={filteredBeers}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <List.Item
            title={item.name}
            description={item.brewery}
            onPress={() => navigation.navigate('BeersShow', { id: item.id })}
            left={props => <List.Icon {...props} icon="beer" />}
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