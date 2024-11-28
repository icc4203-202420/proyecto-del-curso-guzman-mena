import React, { useState } from "react";
import { View, StyleSheet, Text, Image, Button, ActivityIndicator, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

// Función para convertir Blob a Base64
const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(",")[1]); // Obtiene solo el contenido Base64
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const Home = () => {
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);

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

  // Función para enviar la imagen al backend en Base64
  const sendToBackendWeb = async (imageUri) => {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();

      // Convertir Blob a Base64
      const base64 = await blobToBase64(blob);

      // Crear el payload para enviar al backend
      const payload = {
        image: base64,
      };
    
      const apiUrl = "http://192.168.0.123:3001/api/v1/events/1/upload_photo";

      // Enviar la imagen al backend como JSON
      const res = await axios.post(apiUrl, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Respuesta del servidor:", res.data);
    } catch (error) {
      console.error("Error al enviar la imagen:", error);
    }
  };

  // Función para manejar la subida de la imagen
  const handleUploadPhoto = async () => {
    if (!imageUri) {
      alert("Selecciona una imagen primero.");
      return;
    }

    setLoading(true);

    // if (Platform.OS === "web") {
      await sendToBackendWeb(imageUri); // Envía la imagen en web como Base64
    // }

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
