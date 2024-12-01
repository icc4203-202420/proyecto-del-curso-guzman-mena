import React, { useEffect, useState } from "react";
import { View, Image, FlatList, StyleSheet, Text, ScrollView } from "react-native";
import axios from "axios";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Obtener las imágenes desde el backend
  const fetchImages = async () => {
    try {
      const response = await axios.get("http://192.168.0.123:3001/api/v1/events/1/photo_index");
      setImages(response.data.images); // Asignar la lista de fotos
    } catch (error) {
      console.error("Error al cargar las imágenes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages(); // Llamar la función para obtener las imágenes al montar el componente
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Cargando...</Text> // Mostrar mensaje de carga
      ) : (
        <FlatList
          data={images}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.cardContainer}>
              {/* Mostrar la imagen */}
              <Image 
                source={{ uri: `http://192.168.0.123:3001${item.path}` }} 
                style={styles.image} 
              />

              {/* Descripción de la imagen */}
              <Text style={styles.description}>{item.description}</Text>

              {/* Nombre del usuario que subió la imagen */}
              <Text style={styles.userName}>{item.user.name}</Text>

              {/* Mostrar los targets en tarjetas */}
              <ScrollView
                horizontal={true}
                contentContainerStyle={styles.targetContainer} // Aquí se aplica justifyContent
              >
                {item.targets.map((target, index) => (
                  <View key={index} style={styles.targetCard}>
                    <Text style={styles.targetText}>{target.user_name}</Text>
                  </View>
                ))}
              </ScrollView>
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
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 20,
    width: "90%",
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 5,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 10,
  },
  description: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 16,
    color: "#333",
  },
  userName: {
    marginTop: 5,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
    color: "#555",
  },
  targetContainer: {
    marginTop: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center", // Ahora esta propiedad está dentro de contentContainerStyle
  },
  targetCard: {
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
    margin: 5,
  },
  targetText: {
    color: "#333",
    fontSize: 14,
  },
});

export default Gallery;
