import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, ScrollView } from 'react-native';  
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { REACT_APP_API_URL } from '@env';

export default function EventShow() {
  const { event_id } = useLocalSearchParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = REACT_APP_API_URL;

  useEffect(() => {
    // Fetch event details from the API
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/v1/events/${event_id}`); // editar aca
        setEvent(response.data.event || {});  
        setLoading(false);
      } catch (error) {
        console.error('Error fetching event:', error);
        setError('Error al cargar el evento');
        setLoading(false);
      }
    };
    fetchEvent();
  }, [event_id]);

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
    <ScrollView style={styles.container}>
      <View style={styles.eventDetails}>
        {event.image_url && (
          <Image source={{ uri: event.image_url }} style={styles.eventImage} />
        )}
        <Text style={styles.title}>{event.name}</Text>
        <Text style={styles.date}>
          {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}
        </Text>
        <Text style={styles.description}>{event.description}</Text>
        <Text style={styles.bar}>Bar: {event.bar_id}</Text>
      </View>
    </ScrollView>
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
  eventDetails: {
    alignItems: 'center',
    padding: 10,
  },
  eventImage: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  date: {
    fontSize: 18,
    color: 'gray',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  bar: {
    fontSize: 16,
    color: 'gray',
  },
});
