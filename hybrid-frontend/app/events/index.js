import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, ActivityIndicator, Image } from 'react-native';  
import { Searchbar, List } from 'react-native-paper';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { REACT_APP_API_URL } from '@env';

export default function EventsIndex() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = REACT_APP_API_URL;

  useEffect(() => {
    // Fetch events from the API
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/v1/events`); 
        setEvents(response.data.events || response.data || []);  
        setLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('Error al cargar los eventos');
        setLoading(false);
      }
    };
    fetchEvents();
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
        placeholder="Buscar eventos"
        onChangeText={setSearchQuery}
        value={searchQuery}
      />

      <FlatList
        data={events.filter(event => event.name.toLowerCase().includes(searchQuery.toLowerCase()))} 
        keyExtractor={item => item.id.toString()} 
        renderItem={({ item }) => (
          <List.Item
            title={item.name}
            description={`Fecha: ${item.start_date} - ${item.end_date}`}
            onPress={() => router.push(`/events/${item.id}`)}
            left={props => (
              item.image_url ? (
                <Image source={{ uri: item.image_url }} style={styles.eventImage} />
              ) : (
                <List.Icon {...props} icon="calendar" />
              )
            )}
          />
        )}
        ListEmptyComponent={<Text style={styles.center}>No se encontraron eventos.</Text>}
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
  eventImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});
