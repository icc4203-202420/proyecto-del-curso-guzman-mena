import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, ActivityIndicator } from 'react-native';  
import { Searchbar, List } from 'react-native-paper';
import axios from 'axios';
import { useRouter } from 'expo-router';


export default function BarsIndex({ navigation }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [bars, setBars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch bars from the API
    const fetchBars = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:3001/api/v1/bars'); 
        setBars(response.data.bars || response.data || []);  
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bars:', error);
        setError('Error al cargar los bares');
        setLoading(false);
      }
    };
    fetchBars();
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
        placeholder="Buscar bares"
        onChangeText={setSearchQuery}
        value={searchQuery}
      />

      <FlatList
        data={bars} 
        keyExtractor={item => item.id.toString()} 
        renderItem={({ item }) => (
          <List.Item
            title={item.name}
            description={`Ubicación: ${item.location || 'No especificada'}`} 
            onPress={() => router.push(`/bars/${item.id}`)}
            left={props => <List.Icon {...props} icon="store" />}
          />
        )}
        ListEmptyComponent={<Text style={styles.center}>No se encontraron bares.</Text>}
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
});
