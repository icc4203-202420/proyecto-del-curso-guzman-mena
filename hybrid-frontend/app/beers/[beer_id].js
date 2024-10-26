import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, TextInput, Alert } from 'react-native';
import { Text, Card, Title, Paragraph, Button } from 'react-native-paper';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function BeersShow() {
  const { beer_id } = useLocalSearchParams()
  const [userId, setUserId] = useState(null); // Inicializar como null
  const [beer, setBeer] = useState(null);  // Estado para almacenar los detalles de la cerveza
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newReview, setNewReview] = useState('');  // Texto de la nueva reseña
  const [newRating, setNewRating] = useState('');  // Rating de la nueva reseña
  const [reviewError, setReviewError] = useState('');  // Mensaje de error para la reseña
  const [successMessage, setSuccessMessage] = useState(''); // Mensaje de éxito al agregar reseña


    // Cargar el user_id desde AsyncStorage
    useEffect(() => {
      const fetchUserId = async () => {
        const storedUserId = await AsyncStorage.getItem('@user_id');
        setUserId(storedUserId);
      };
  
      fetchUserId();
    }, []);

  // Realizar la solicitud para obtener los detalles de la cerveza
  useEffect(() => {
    const fetchBeerDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:3001/api/v1/beers/${beer_id}`);
        setBeer(response.data.beer || response.data);  // Ajustar según la estructura de la respuesta
        setLoading(false);
      } catch (error) {
        console.error('Error fetching beer details:', error);
        setError('Error al cargar los detalles de la cerveza');
        setLoading(false);
      }
    };
    fetchBeerDetails();
  }, [beer_id]);

  const handleSubmitReview = async () => {
    if (!userId) {
      // Mostrar alerta si el usuario no está logueado
      Alert.alert("Iniciar sesión", "Debes iniciar sesión para agregar una reseña.");
      return;
    }

    const wordCount = newReview.trim().split(/\s+/).length;
    if (wordCount < 15) {
      setReviewError('La reseña debe contener al menos 15 palabras.');
      return;
    }

    // Validar que el rating sea un número entre 0 y 5 con decimales
    const rating = parseFloat(newRating);
    if (isNaN(rating) || rating < 0 || rating > 5) {
      setReviewError('El rating debe ser un número entre 0 y 5.');
      return;
    }

    try {
      // Enviar la reseña al backend con user_id fijo en 1
      await axios.post(`http://127.0.0.1:3001/api/v1/beers/${beer_id}/reviews`, {
        review: {
          text: newReview,
          rating: rating,
          user_id: userId,  
        }
      });
      setSuccessMessage('Reseña agregada exitosamente.');
      setNewReview('');  // Limpiar el campo de reseña
      setNewRating('');  // Limpiar el campo de rating
      setReviewError('');  // Limpiar el mensaje de error
    } catch (error) {
      setReviewError('Error al enviar la reseña.');
      console.error('Error submitting review:', error);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;  // Indicador de carga mientras se obtienen los detalles
  }

  if (error) {
    return <Text>{error}</Text>;  // Mostrar error si ocurrió un problema
  }

  if (!beer) {
    return <Text>Cerveza no encontrada</Text>;  // Mostrar mensaje si no se encuentra la cerveza
  }
  
  return (
    <View style={styles.container}>
      <Card>
        <Card.Content>
          <Title>{beer.name}</Title>
          <Paragraph>Estilo: {beer.style}</Paragraph>
          <Paragraph>Lúpulo: {beer.hop}</Paragraph>
          <Paragraph>Levadura: {beer.yeast}</Paragraph>
          <Paragraph>Maltas: {beer.malts}</Paragraph>
          <Paragraph>IBU: {beer.ibu}</Paragraph>
          <Paragraph>Alcohol: {beer.alcohol}</Paragraph>
          <Paragraph>BLG: {beer.blg}</Paragraph>
          <Paragraph>Rating Promedio: {beer.avg_rating}</Paragraph>
          {/* Mostrar la cervecería */}
          {beer.brewery && (
            <Paragraph>
              Cervecería: {beer.brewery.name} (Establecida en {beer.brewery.estdate})
            </Paragraph>
          )}
        </Card.Content>
      </Card>

      {/* Mostrar los bares donde se sirve la cerveza */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Bares que sirven esta cerveza</Title>
          {beer.bars && beer.bars.length > 0 ? (
            beer.bars.map((bar) => (
              <Paragraph key={bar.id}>
                {bar.name} (Latitud: {bar.latitude}, Longitud: {bar.longitude})
              </Paragraph>
            ))
          ) : (
            <Text>No se encontraron bares que sirvan esta cerveza.</Text>
          )}
        </Card.Content>
      </Card>

      {/* Mostrar las reseñas existentes */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Reseñas</Title>
          {beer.reviews && beer.reviews.length > 0 ? (
            beer.reviews.map((review, index) => (
              <Paragraph key={index}>
                {review.text} - Calificación: {review.rating} - Usuario: {review.user_first_name}
              </Paragraph>
            ))
          ) : (
            <Text>No hay reseñas disponibles.</Text>
          )}
        </Card.Content>
      </Card>

      {/* Formulario para agregar una nueva reseña */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Agregar Reseña</Title>
          {reviewError ? <Text style={styles.errorText}>{reviewError}</Text> : null}
          {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}

          <TextInput
            style={styles.input}
            multiline
            numberOfLines={4}
            placeholder="Escribe tu reseña (mínimo 15 palabras)"
            value={newReview}
            onChangeText={setNewReview}
          />

          <TextInput
            style={styles.input}
            placeholder="Calificación (0 - 5)"
            keyboardType="numeric"
            value={newRating}
            onChangeText={setNewRating}
          />

          <Button mode="contained" onPress={handleSubmitReview}>
            Enviar Reseña
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    marginTop: 20,
  },
  input: {
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  successText: {
    color: 'green',
    marginBottom: 10,
  },
});
