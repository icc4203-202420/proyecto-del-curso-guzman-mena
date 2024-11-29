import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Image, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getItem } from "../../util/Storage";


const CreatePost = () => {
  const router = useRouter();
  const { bar_id, event_id } = useLocalSearchParams();

  const [description, setDescription] = useState("");
  const [taggedHandles, setTaggedHandles] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [userId, setUserId] = useState(null);

  const fetchUserId = async () => {
    const storedUserId = await getItem("userId");
    setUserId(storedUserId);
  };

  useEffect(() => {
    fetchUserId();
  }, []);

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

  const handleCreatePost = async () => {
    if (!description) {
      alert("La descripción es obligatoria");
      return;
    }

    try {
      const payload = {
        user_id: userId,
        event_id: event_id,
        description: description,
        tagged_handles: taggedHandles.split(",").map((handle) => handle.trim()),
      };

      if (imageUri) {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = async () => {
          payload.image = reader.result.split(",")[1]; // Base64
          await axios.post(`${REACT_APP_API_URL}/api/v1/events/${event_id}/create_post`, payload, {
            headers: { "Content-Type": "application/json" },
          });
          alert("Publicación creada exitosamente");
          router.push(`/bars/${bar_id}`);
        };
        reader.readAsDataURL(blob);
      } else {
        await axios.post(`${REACT_APP_API_URL}/api/v1/events/${event_id}/create_post`, payload, {
          headers: { "Content-Type": "application/json" },
        });
        alert("Publicación creada exitosamente");
        router.push(`/bars/${bar_id}`);
      }
    } catch (error) {
      console.error("Error al crear publicación:", error);
      alert("Hubo un error al crear la publicación");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Publicación</Text>
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Handles etiquetados (separados por comas)"
        value={taggedHandles}
        onChangeText={setTaggedHandles}
      />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      <Button title="Seleccionar Foto" onPress={handleSelectPhoto} />
      <Button title="Crear Publicación" onPress={handleCreatePost} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
});

export default CreatePost;
