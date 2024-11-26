import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Searchbar, List } from 'react-native-paper';

// Lista de cervezas de ejemplo
const beerList = [
  { id: '1', name: 'Corona' },
  { id: '2', name: 'Heineken' },
  { id: '3', name: 'Stella Artois' },
  { id: '4', name: 'Budweiser' },
  { id: '5', name: 'Guinness' },
];

export default function BeerScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBeers, setFilteredBeers] = useState(beerList);

  const onChangeSearch = (query) => {
    setSearchQuery(query);
    const filtered = beerList.filter(beer =>
      beer.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredBeers(filtered);
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Buscar cerveza"
        onChangeText={onChangeSearch}
        value={searchQuery}
        style={styles.searchbar}
      />
      <FlatList
        data={filteredBeers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <List.Item
            title={item.name}
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
    backgroundColor: '#fff',
  },
  searchbar: {
    margin: 10,
  },
});