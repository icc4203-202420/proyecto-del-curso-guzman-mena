import React, { useEffect, useState } from "react";
import { View, Image, FlatList, StyleSheet, Text } from "react-native";
import axios from "axios";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
//   const apiUrl = REACT_APP_API_URL;

  // Obtener las imágenes desde el backend
  const fetchImages = async () => {
    try { 
      const response = await axios.get("http://127.0.0.1:3001/api/v1/events/3/photo_index");
      setImages(response.data.images);
    } catch (error) {
      console.error("Error al cargar las imágenes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Cargando...</Text>
      ) : (
        <FlatList
          data={images}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.imageContainer}>
              <Image source={{ uri: `http://127.0.0.1:3001${item}` }} style={styles.image} />
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    marginBottom: 10,
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
});

export default Gallery;
