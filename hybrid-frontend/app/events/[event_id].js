import { View, Text, StyleSheet, ActivityIndicator, Image, ScrollView } from 'react-native';
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

  // Subir imagen al backend
  const handleUploadPhoto = async () => {
    if (!imageUri) {
      alert("Selecciona una imagen primero.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const base64 = await blobToBase64(blob);

      await axios.post(`${apiUrl}/api/v1/events/${event_id}/upload_photo`, {
        image: base64,
        description: "Descripción de ejemplo",
        user_id: userId,
        target: [1,2,3]
      });

      alert("Imagen subida con éxito");
    } catch (error) {
      console.error("Error al subir la imagen:", error);
    }
    setLoading(false);
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
        <Title style={styles.subtitle}>Seleccionar y Subir Imagen</Title>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.selectedImage} />
        ) : (
          <Text style={styles.placeholder}>No se ha seleccionado ninguna imagen</Text>
        )}
        <Button mode="contained" onPress={handleSelectPhoto} style={styles.button}>
          Seleccionar Foto
        </Button>
        <Button mode="contained" onPress={handleUploadPhoto} style={styles.button}>
          Subir Foto
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
});
