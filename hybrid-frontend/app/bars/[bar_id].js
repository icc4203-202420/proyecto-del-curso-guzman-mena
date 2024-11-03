import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { Text, Card, Title, Paragraph, Button } from 'react-native-paper';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { REACT_APP_API_URL } from '@env';

export default function BarsShow() {
  const { bar_id } = useLocalSearchParams();
  const [userId, setUserId] = useState(null); 
  const [bar, setBar] = useState(null);
  const [events, setEvents] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attendances, setAttendances] = useState({});
  const [userAttendanceStatus, setUserAttendanceStatus] = useState({});
  const apiUrl = REACT_APP_API_URL;
  
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


  const fetchAttendances = async (eventId) => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/events/${eventId}/attendances`);
      setAttendances(prevAttendances => ({
        ...prevAttendances,
        [eventId]: response.data.attendees || []
      }));

      if (userId) {
        const userAttendance = response.data.attendees.some(attendance => attendance.user_id.toString() === userId.toString());
        setUserAttendanceStatus(prevStatus => ({
          ...prevStatus,
          [eventId]: userAttendance
        }));
      }

    } catch (error) {
      console.error(`Error al cargar asistentes del evento ${eventId}:`, error);
    }
  };

  // Cargar asistencias para cada evento
  useEffect(() => {
    events.forEach(event => {
      fetchAttendances(event.id);
    });
  }, [events]);


  const handleAttendance = async (eventId) => {
    if (!userId) {
      Alert.alert('Error', 'Debes iniciar sesión para confirmar asistencia.');
      return;
    }

    const isAttending = userAttendanceStatus[eventId];

    try {
      if (isAttending) {
        // Desconfirmar asistencia
        await axios.delete(`${apiUrl}api/v1/events/${eventId}/attendances/${userId}`);
      } else {
        // Confirmar asistencia
        await axios.post(`${apiUrl}/api/v1/events/${eventId}/attendances`, { user_id: userId });
      }
      
      // Actualizar el estado de asistencia y recargar la lista de asistentes
      setUserAttendanceStatus(prevStatus => ({
        ...prevStatus,
        [eventId]: !isAttending
      }));
      fetchAttendances(eventId); // Recargar lista de asistentes

    } catch (error) {
      console.error('Error al cambiar el estado de asistencia:', error);
    }
  };


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
                 {/* Mostrar los handles confirmados */}
                 <Card style={styles.card}>
                    <Card.Content>
                      <ScrollView contentContainerStyle={styles.scrollContainer}>
                        {attendances[event.id] && attendances[event.id].length > 0 ? (
                          attendances[event.id].map((attendance, idx) => (
                            <Text key={idx}>{attendance.first_name + " " +attendance.last_name}</Text> 
                          ))
                        ) : (
                          <Text>No attendees confirmed yet.</Text>
                        )}
                      </ScrollView>
                    </Card.Content>
                  </Card>



                <Button 
                  mode="contained" 
                  onPress={() => handleAttendance(event.id)} 
                  style={styles.button}>
                  {userAttendanceStatus[event.id] ? 'Desconfirmar Asistencia' : 'Confirmar Asistencia'}
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
    paddingVertical: 0.3, 
    paddingHorizontal: 0.2, 
    width: 200, 
    alignSelf: 'flex-start', 
    marginVertical: 3,
  },




});
