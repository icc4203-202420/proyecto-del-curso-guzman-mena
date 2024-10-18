import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';  // Usamos este hook para la navegación

const Bars = () => {
  const [bars, setBars] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigation = useNavigation(); // Hook para la navegación

  useEffect(() => {
    // Fetch bars from the API
    const fetchBars = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:3001/api/v1/bars'); // Ajusta la URL
        setBars(response.data.bars || []); // Asegúrate de que los datos estén en response.data.bars
      } catch (error) {
        console.error('Error fetching bars:', error);
      }
    };
    fetchBars();
  }, []);

  // Filtrar bares en función del término de búsqueda
  const filteredBars = bars.filter((bar) =>
    bar.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Manejar clic en el botón
  const handleBarClick = (barId) => {
    navigation.navigate('BarEvents', { barId }); // Redirige a la página de eventos del bar
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Bares</Text>

      <TextInput
        style={styles.input}
        placeholder="Buscar bares..."
        value={searchTerm}
        onChangeText={(text) => setSearchTerm(text)}
      />

      <FlatList
        data={filteredBars}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleBarClick(item.id)}
            >
              <Text style={styles.buttonText}>Ver Eventos</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.noBarsText}>No se encontraron bares.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  card: {
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 15,
    borderRadius: 5,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  noBarsText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
});

export default Bars;
