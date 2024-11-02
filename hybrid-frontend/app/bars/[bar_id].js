import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Text, Card, Title, Paragraph, Button } from 'react-native-paper';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BarsShow() {
  const { bar_id } = useLocalSearchParams();
  const [userId, setUserId] = useState(null); 
  const [bar, setBar] = useState(null);
  const [events, setEvents] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('@user_id');
        setUserId(storedUserId);
      } catch (e) {
        console.error('Error al obtener el ID de usuario:', e);
      }
    };
    fetchUserId();
  }, []);



  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/v1/bars/${bar_id}/events`);
        setBar(response.data.bar || response.bar);
        setEvents(response.data.events || response.events);
      
        console.log("Detalles de los eventos", response.data.events || response.data);
        console.log("Detalles del bar", response.data.bar || response.data);


      } catch (error) {
        console.error('Error al cargar los datos:', error);
        setError('Error al cargar los Datos');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [bar_id]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text>Cargando ...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={styles.errorText}>{error}</Text>
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

          <Card style={styles.card}>
            <Card.Content>
              <Title>Dirección</Title>
              <Paragraph>Línea 1: {bar.address?.line1}</Paragraph>
              <Paragraph>Línea 2: {bar.address?.line2 || 'N/A'}</Paragraph>
              <Paragraph>Ciudad: {bar.address?.city}</Paragraph>
              <Paragraph>País: {bar.address?.country?.name}</Paragraph>
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
                <Title style={styles.reviewTitle}>{`${event.name}`}</Title>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text>Description: {event.description}</Text>
                <Text>Date: {event.date}</Text>
                <Text>Cofirmed:</Text>
                <Card style={styles.card}>
                <Card.Content>
                  <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {/* Mostrar los handles confirmados */}
                    {event.attendances && event.attendances.length > 0 ? (
                      event.attendances.map((attendance, idx) => (
                        <Text key={idx}>{attendance.user.handle}</Text> 
                      ))
                    ) : (
                      <Text>No attendees confirmed yet.</Text>
                    )}
                  </ScrollView>
                </Card.Content>
              </Card>
                <Button 
                mode="contained" 
                  onPress={() => router.push()} style={styles.button}>
                  Confirm Attendance
              </Button>
              </ScrollView>
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

// me tiene que pasar
// - nombre user
// - eventos
// - - asistentes al evento
// - cervesas que sirva

// seccion donde me pueda inscribir a los eventos (boton en events)


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
  eventTitle: {
    fontWeight: 'bold',
  },
  eventContent: {
    fontSize: 14,
    color: '#333',
  },
  button: {
    paddingVertical: 0.3, // Ajusta el padding vertical
    paddingHorizontal: 0.2, // Ajusta el padding horizontal
    width: 200, // Ancho del botón
    alignSelf: 'flex-start', // Alinea el botón a la izquierda
    marginVertical: 3, // Espaciado vertical
  },




});
