import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, ScrollView, Alert, Text } from 'react-native';
import { Text as PaperText, Card, Title, Paragraph, Button } from 'react-native-paper';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { REACT_APP_API_URL } from '@env';
import { getItem } from "../../util/Storage";

export default function BarsShow() {
  const { bar_id } = useLocalSearchParams();
  const router = useRouter();
  const [bar, setBar] = useState(null);
  const [events, setEvents] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = REACT_APP_API_URL;
  

  useEffect(() => {
    const fetchBarDetails = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/v1/bars/${bar_id}/events`);
        setBar(response.data.bar || response.bar);
        setEvents(response.data.events || response.events);
      } catch (error) {
        console.error('Error al cargar detalles del bar y eventos:', error);
        setError('Error al cargar los detalles del bar y eventos');
      } finally {
        setLoading(false);
      }
    };
    fetchBarDetails();
  }, [bar_id]);
  
  useEffect(() => {
    events.forEach((event) => {
    });
  }, [events]);


  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <PaperText>Cargando ...</PaperText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loaderContainer}>
        <PaperText style={styles.errorText}>{error}</PaperText>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {bar && (
        <>
          <Card style={styles.card}>
            <Card.Content>
              <Title>{bar.name}</Title>
              <Paragraph>Latitude: {bar.latitude}</Paragraph>
              <Paragraph>Longitude: {bar.longitude}</Paragraph>
            </Card.Content>
          </Card>
        </>
      )}

      <Card style={styles.card}>
        <Card.Content>
          <Title>Events</Title>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {events.length > 0 ? (
              events.map((event, index) => (
                <Card key={index} style={styles.eventCard}>
                  <Title style={styles.reviewTitle}>{event.name}</Title>
                  <Text>Description: {event.description}</Text>
                  <Text>Date: {event.date}</Text>


                  {/* Botón para redirigir a la vista de creación de publicaciones */}
                  <Button 
                    mode="contained" 
                    onPress={() => router.push(`/events/${event.id}`)} 
                    style={styles.button}>
                    Ir a Evento
                  </Button>
                </Card>
              ))
            ) : (
              <Text>No hay eventos disponibles.</Text>
            )}
          </ScrollView>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  card: {
    marginBottom: 10,
    backgroundColor: 'white',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  scrollContainer: {
    maxHeight: '100%',
  },
  eventCard: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  button: {
    marginVertical: 10,
  },
});
