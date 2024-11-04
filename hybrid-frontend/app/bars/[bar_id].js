import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { Text, Card, Title, Paragraph, Button } from 'react-native-paper';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
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

// Función para subir foto
const uploadPhoto = async (eventId) => {
  console.log(`Intentando subir foto para el evento: ${eventId}`);

  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permissionResult.granted) {
    alert("Se requiere permiso para acceder a la galería de imágenes.");
    console.log("Permisos denegados para acceder a la galería.");
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 1,
  });

  console.log("Resultado de la selección de imagen:", result);

  if (result.canceled) {
    alert("No se seleccionó ninguna imagen.");
    console.log("Usuario canceló la selección de imagen.");
    return;
  }

  const selectedAsset = result.assets && result.assets[0];
  if (selectedAsset && selectedAsset.uri) {
    const localUri = selectedAsset.uri;
    const filename = localUri.split('/').pop();

    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;

    console.log("Información de la imagen seleccionada:", { localUri, filename, type });

    const formData = new FormData();
    formData.append('photo', {
      uri: localUri,
      name: filename,
      type,
    });

    try {
      console.log("Enviando solicitud POST al backend para subir la imagen...");
      const response = await fetch(`${apiUrl}/api/v1/events/${eventId}/upload_photo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const responseData = await response.json();
      console.log("Respuesta del servidor:", responseData);

      if (response.ok) {
        console.log('Foto subida exitosamente:', responseData);
        alert(`Foto subida exitosamente. Ruta del archivo: ${responseData.path}`);
      } else {
        console.error('Error al subir la foto:', responseData);
        alert(`Error al subir la foto: ${responseData.error || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('Error al subir la foto:', error);
      alert('Hubo un error al subir la foto');
    }
  } else {
    console.log("No se encontró URI en el resultado de la imagen.");
    alert("Hubo un problema al seleccionar la imagen.");
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

                {/* Botón para subir foto */}
                <Button 
                  mode="contained" 
                  onPress={() => uploadPhoto(event.id)} 
                  style={styles.button}>
                  Subir Foto
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
