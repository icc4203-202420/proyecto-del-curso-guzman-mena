import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, ActivityIndicator } from 'react-native';  
import { Searchbar, List, Button } from 'react-native-paper';
import axios from 'axios';
import {useRouter } from 'expo-router'


export default function BeersIndex({ navigation }) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('');
  const [beers, setBeers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch beers from the API
    const fetchBeers = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:3001/api/v1/beers'); 
        setBeers(response.data.beers || response.data || []);  
        setLoading(false);
      } catch (error) {
        console.error('Error fetching beers:', error);
        setError('Error al cargar las cervezas');
        setLoading(false);
      }
    };
    fetchBeers();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando...</Text>
      </View>
    );
  }

  if (error) {
    return <View style={styles.center}><Text>{error}</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Buscar cervezas"
        onChangeText={setSearchQuery}
        value={searchQuery}
      />

      <FlatList
        data={beers}
        keyExtractor={item => item.id.toString()} 
        renderItem={({ item }) => (
          <List.Item
            title={item.name}
            description={`Estilo: ${item.style || 'Desconocido'}`}  
            onPress={() => router.push(`/beers/${item.id}`)}
            left={props => <List.Icon {...props} icon="beer" />}
          />
        )}
        ListEmptyComponent={<Text style={styles.center}>No se encontraron cervezas.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tempButton: {
    marginVertical: 20,
  },
});
