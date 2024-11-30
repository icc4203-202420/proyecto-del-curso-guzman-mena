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
        const storedUserId = await getItem('userId');
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
      setAttendances((prevAttendances) => ({
        ...prevAttendances,
        [eventId]: response.data.attendees || [],
      }));

      if (userId) {
        const userAttendance = response.data.attendees.some(
          (attendance) => attendance.user_id.toString() === userId.toString()
        );
        setUserAttendanceStatus((prevStatus) => ({
          ...prevStatus,
          [eventId]: userAttendance,
        }));
      }
    } catch (error) {
      console.error(`Error al cargar asistentes del evento ${eventId}:`, error);
    }
  };

  useEffect(() => {
    events.forEach((event) => {
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
        await axios.delete(`${apiUrl}api/v1/events/${eventId}/attendances/${userId}`);
      } else {
        await axios.post(`${apiUrl}/api/v1/events/${eventId}/attendances`, { user_id: userId });
      }
      
      setUserAttendanceStatus((prevStatus) => ({
        ...prevStatus,
        [eventId]: !isAttending,
      }));
      fetchAttendances(eventId);
    } catch (error) {
      console.error('Error al cambiar el estado de asistencia:', error);
    }
  };

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

                  <Button 
                    mode="contained" 
                    onPress={() => handleAttendance(event.id)} 
                    style={styles.button}>
                    {userAttendanceStatus[event.id] ? 'Desconfirmar Asistencia' : 'Confirmar Asistencia'}
                  </Button>

                  {/* Botón para redirigir a la vista de creación de publicaciones */}
                  <Button 
                    mode="contained" 
                    onPress={() => router.push(`/bars/CreatePost`)} 
                    style={styles.button}>
                    Subir Publicación
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
