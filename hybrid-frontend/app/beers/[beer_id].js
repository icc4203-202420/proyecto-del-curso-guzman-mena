import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, TextInput, Alert, ScrollView } from 'react-native';
import { Text, Card, Title, Paragraph, Button } from 'react-native-paper';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { REACT_APP_API_URL } from '@env';
import { saveItem, getItem, deleteItem } from "../../util/Storage";

export default function BeersShow() {
  const { beer_id } = useLocalSearchParams();
  const [userId, setUserId] = useState(null);
  const [beer, setBeer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const apiUrl = REACT_APP_API_URL;

  useEffect(() => {
    const fetchUserId = async () => {
      setUserId(storedUserId);
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchBeerDetails = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/v1/beers/${beer_id}`);
        setBeer(response.data.beer || response.data);
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
      Alert.alert("Iniciar sesión", "Debes iniciar sesión para agregar una reseña.");
      return;
    }

    const wordCount = newReview.trim().split(/\s+/).length;
    if (wordCount < 15) {
      setReviewError('La reseña debe contener al menos 15 palabras.');
      return;
    }

    const rating = parseFloat(newRating);
    if (isNaN(rating) || rating < 0 || rating > 5) {
      setReviewError('El rating debe ser un número entre 0 y 5.');
      return;
    }

    try {
      await axios.post(`${apiUrl}/api/v1/beers/${beer_id}/reviews`, {
        review: {
          text: newReview,
          rating: rating,
          user_id: userId,
        }
      });
      setSuccessMessage('Reseña agregada exitosamente.');
      setNewReview('');
      setNewRating('');
      setReviewError('');
    } catch (error) {
      setReviewError('Error al enviar la reseña.');
      console.error('Error submitting review:', error);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  if (!beer) {
    return <Text>Cerveza no encontrada</Text>;
  }
  
  return (
    <ScrollView style={styles.container}>
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
          {beer.brewery && (
            <Paragraph>
              Cervecería: {beer.brewery.name} (Establecida en {beer.brewery.estdate})
            </Paragraph>
          )}
        </Card.Content>
      </Card>

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
    </ScrollView>
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
