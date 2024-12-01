import { View, Text, StyleSheet, ActivityIndicator, Image, ScrollView, TextInput, FlatList } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';
import { saveItem, getItem, deleteItem } from "../../util/Storage";
import React, { useState, useEffect } from 'react';
import * as ImagePicker from "expo-image-picker";
import { REACT_APP_API_URL } from '@env';  
import axios from 'axios';

// Función para convertir Blob a Base64
const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(",")[1]); // Base64
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export default function EventShow() {
  const { event_id } = useLocalSearchParams();
  const [userId, setUserId] = useState(null);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [description, setDescription] = useState('');
  const [attendances, setAttendances] = useState({});
  const [userAttendanceStatus, setUserAttendanceStatus] = useState({});
  const [searchHandle, setSearchHandle] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [targetList, setTargetList] = useState([]);
  const apiUrl = REACT_APP_API_URL;

  useEffect(() => {
    const fetchUserId = async () => {
      const storedUserId = await getItem('userId');
      setUserId(storedUserId);
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/v1/events/${event_id}`);
        setEvent(response.data.event || {});
        setLoading(false);
      } catch (error) {
        setError('Error al cargar el evento');
        setLoading(false);
      }
    };
    fetchEvent();
  }, [event_id]);


  const fetchAttendances = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/events/${event_id}/attendances`);
      setAttendances(response.data.attendees || []);  // Guardar los asistentes del evento
      if (userId) {
        const userAttendance = response.data.attendees.some(
          (attendance) => attendance.user_id.toString() === userId.toString()
        );
        setUserAttendanceStatus(userAttendance);  // Estado de asistencia del usuario
      }
    } catch (error) {
      console.error('Error al cargar asistentes del evento:', error);
    }
  };

  useEffect(() => {
    fetchAttendances();  // Llamar solo para el evento actual
  }, [event_id]);  // Dependencia en `event_id` para actualizar cuando cambie


  const handleAttendance = async () => {
    if (!userId) {
      Alert.alert('Error', 'Debes iniciar sesión para confirmar asistencia.');
      return;
    }
  
    const isAttending = userAttendanceStatus;
  
    try {
      if (isAttending) {
        // Eliminar asistencia
        await axios.delete(`${apiUrl}/api/v1/events/${event_id}/attendances/${userId}`);
      } else {
        // Confirmar asistencia
        await axios.post(`${apiUrl}/api/v1/events/${event_id}/attendances`, { user_id: userId });
      }
  
      // Actualizar estado
      setUserAttendanceStatus(!isAttending);
      fetchAttendances();  // Volver a cargar los asistentes
    } catch (error) {
      console.error('Error al cambiar el estado de asistencia:', error);
    }
  };
  

  // Seleccionar imagen
  const handleSelectPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  // Manejar cambio en la descripción
  const handleDescriptionChange = (text) => {
    setDescription(text);
  };


  // Subir imagen y descripción al backend
  const handleUploadPhoto = async () => {
    if (!imageUri) {
      alert("Selecciona una imagen primero.");
      return;
    }

    if (!description.trim()) {
      alert("Escribe una descripción para la imagen.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const base64 = await blobToBase64(blob);

      const targetIds = targetList.map(target => target.id);


      await axios.post(`${apiUrl}/api/v1/events/${event_id}/upload_photo`, {
        image: base64,
        description: description, // Enviando la descripción
        user_id: userId,
        target: targetIds
      });

      alert("Imagen y descripción subidas con éxito");
    } catch (error) {
      console.error("Error al subir la imagen:", error);
    }
    setLoading(false);
  };


  const searchUserByHandle = async (handle) => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/users/search?handle=${handle}`);
      if (response.status === 200) {
        setSearchResults(response.data.users);
        setError('');
      } else {
        setSearchResults([]);
        setError('No se encontraron usuarios.');
      }
    } catch (error) {
      console.error('Error en la búsqueda de usuario:', error);
      setError('Error al buscar usuario.');
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchHandle.length > 0) {
        searchUserByHandle(searchHandle);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchHandle]);

  const addTargget = (targetId, targetName) => {
    if (!targetList.some((target) => target.id === targetId)) {
      setTargetList([...targetList, { id: targetId, name: targetName }]);
      console.log(`Target ID ${targetId} agregado exitosamente.`);
    } else {
      console.log(`Target ID ${targetId} ya está en la lista.`);
    }
  };
  

  const removeTarget = (targetId) => {
    setTargetList(targetList.filter((target) => target.id !== targetId));
    console.log(`Target ID ${targetId} eliminado.`);
  };


  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text>Cargando...</Text>
      </View>
    );
  }

  if (error) {
    return <View style={styles.center}><Text>{error}</Text></View>;
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        {event.image_url && (
          <Image source={{ uri: event.image_url }} style={styles.eventImage} />
        )}
        <Card.Content>
          <Title style={styles.title}>{event.name}</Title>
          <Paragraph style={styles.date}>
            {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}
          </Paragraph>
          <Paragraph style={styles.description}>{event.description}</Paragraph>
        </Card.Content>
      </Card>

      <View style={styles.imageSection}>
      <Title style={styles.subtitle}>Imagenes del evento</Title>

      </View>


      <View style={styles.imageSection}>
        <Title style={styles.subtitle}>Seleccionar y Subir Imagen</Title>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.selectedImage} />
        ) : (
          <Text style={styles.placeholder}>No se ha seleccionado ninguna imagen</Text>
        )}
        <TextInput
          style={styles.input}
          placeholder="Escribe una descripción"
          value={description}
          onChangeText={handleDescriptionChange}
        />

        <View style={styles.tagSection}>
          <Title style={styles.subtitle}>Etiquetas de Amigos</Title>
          {targetList.length > 0 ? (
            targetList.map((target) => (
              <View key={target.id} style={styles.tag}>
                <Text style={styles.tagText}>{target.name}</Text>
                <Text
                  style={styles.closeIcon}
                  onPress={() => removeTarget(target.id)}
                >
                  ✕
                </Text>
              </View>
            ))
          ) : (
            <Text>No se han etiquetado amigos.</Text>
          )}
        </View>


        <Title>Etiquetar Amigos</Title>
        <TextInput
          style={styles.input}
          placeholder="Ingrese handle"
          value={searchHandle}
          onChangeText={setSearchHandle}
        />
        <ScrollView>
          {searchResults.length > 0 ? (
            searchResults.map((result) => (
              <View key={result.id} style={styles.friendCard}>
                <Text>{result.first_name} {result.last_name}</Text>
                  <Button mode="outlined" onPress={() => addTargget(result.id, `${result.first_name} ${result.last_name}`)} 
                  style={styles.addButton}>
                  Agregar amigo
                </Button>
              </View>
              ))
            ) : (
              <Text>No se encontraron resultados.</Text>
            )}
          </ScrollView>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}



        <Button mode="contained" onPress={handleSelectPhoto} style={styles.button}>
          Seleccionar Foto
        </Button>
        <Button mode="contained" onPress={handleUploadPhoto} style={styles.button}>
          Subir Foto y Descripción
        </Button>
      </View>
      
      <View style={styles.imageSection}>
      <Text>¿¿Te esperamos??</Text>
      {/* Botón para confirmar/desconfirmar asistencia */}
      <Button
        mode="contained"
        onPress={handleAttendance}
        style={styles.button}
      >
        {userAttendanceStatus ? 'Desconfirmar Asistencia' : 'Confirmar Asistencia'}
      </Button>
    </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f4f4f4',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginBottom: 20,
    borderRadius: 10,
  },
  eventImage: {
    width: '100%',
    height: 250,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  date: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
  },
  imageSection: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  placeholder: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 10,
  },
  button: {
    marginVertical: 10,
    width: '90%',
  },
  input: {
    width: '90%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  friendCard: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
    marginBottom: 5,
  },
  tagSection: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  tag: {
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginVertical: 5,
  },
  tagText: {
    fontSize: 16,
    color: '#333',
  },


  tagSection: {
    marginTop: 20,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 16,
    marginVertical: 5,
    marginRight: 5,
    display: 'flex',
    justifyContent: 'space-between',
    width: 'auto',
  },
  tagText: {
    fontSize: 14,
    color: '#000',
  },
  closeIcon: {
    marginLeft: 10,
    fontSize: 18,
    color: '#FF0000', // Color rojo para la "X"
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  
});
