import React, { useState } from "react";
import { View, StyleSheet, Text, Image, Button, ActivityIndicator } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { REACT_APP_API_URL } from '@env';
import axios from "axios";


import * as FileSystem from 'expo-file-system';

const Home = () => {
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const apiUrl = REACT_APP_API_URL;

  // Función para seleccionar una imagen de la galería
  const handleSelectPhoto = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
    if (!permissionResult.granted) {
      alert("Permiso para acceder a la galería denegado");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };


  // Función para enviar la imagen al backend (modularizada)
  const sendToBackend = async (imageUri) => {
    try {
      // Leer la imagen y convertirla a Base64
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
  
      // Crear el objeto de datos para enviar
      const formData = new FormData();
      formData.append('image', base64);
  
      // Enviar la imagen al backend
      
      const response = await axios.post(`${apiUrl}/api/v1/events/1/upload_photo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log('Respuesta del servidor:', response.data);
    } catch (error) {
      console.error('Error al enviar la imagen:', error);
    }
  };
  // Función para manejar la subida de la imagen
  const handleUploadPhoto = async () => {
    if (!imageUri) {
      alert("Selecciona una imagen primero.");
      return;
    }

    setLoading(true);
    await sendToBackend(imageUri); // Envía la imagen al backend
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seleccionar y Subir Imagen</Text>
      
      {/* Mostrar la imagen seleccionada */}
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <Text style={styles.placeholder}>No se ha seleccionado ninguna imagen</Text>
      )}

      {/* Botón para seleccionar una imagen */}
      <Button title="Seleccionar Foto" onPress={handleSelectPhoto} />

      {/* Botón para subir la imagen */}
      <Button title="Subir Foto" onPress={handleUploadPhoto} />

      {/* Indicador de carga */}
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
    resizeMode: "contain",
  },
  placeholder: {
    marginBottom: 20,
    fontSize: 16,
    color: "#999",
  },
});

export default Home;
