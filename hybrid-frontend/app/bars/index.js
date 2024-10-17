import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Searchbar, List } from 'react-native-paper';

export default function BarsIndex({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');

  // Ejemplo de datos de bares
  const bars = [
    { id: '1', name: 'Bar A', address: 'Calle 1, Ciudad' },
    { id: '2', name: 'Bar B', address: 'Calle 2, Ciudad' },
    { id: '3', name: 'Bar C', address: 'Calle 3, Ciudad' },
    { id: '4', name: 'Bar D', address: 'Calle 4, Ciudad' },
  ];

  const filteredBars = bars.filter(bar =>
    bar.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Buscar bares"
        onChangeText={setSearchQuery}
        value={searchQuery}
      />
      <FlatList
        data={filteredBars}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <List.Item
            title={item.name}
            description={item.address}
            onPress={() => navigation.navigate('BarsShow', { id: item.id })}
            left={props => <List.Icon {...props} icon="glass-mug-variant" />}
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