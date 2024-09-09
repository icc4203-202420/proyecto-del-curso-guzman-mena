import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper, Grid, Button, TextField } from '@mui/material';
import axios from 'axios';

const BeerDetails = () => {
  const { id } = useParams();  // ID de la cerveza desde la URL
  const [beer, setBeer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const currentUserId = parseInt(localStorage.getItem('userId'), 10);  // Obtener el userId del usuario actual
  const token = localStorage.getItem('token'); // Obtener el token

  useEffect(() => {
    const fetchBeerDetails = async () => {
      try {
        const response = await axios.get(`/api/v1/beers/${id}`);
        setBeer(response.data.beer);
      } catch (error) {
        console.error('Error fetching beer details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBeerDetails();
  }, [id]);

  const handleAddReview = async () => {
    if (reviewText.length < 15) {
      setError('La reseña debe tener al menos 15 palabras.');
      return;
    }

    try {
      const response = await axios.post('/api/v1/reviews', {
        review: {
          beer_id: id,
          rating: parseFloat(rating),
          text: reviewText
        }
      }, {
        headers: {
          Authorization: token
        }
      });

      if (response.status === 201) {
        setSuccessMessage('Reseña agregada exitosamente.');
        setError('');
        setReviewText('');
        setRating('');
        setBeer(prevBeer => ({
          ...prevBeer,
          reviews: [...prevBeer.reviews, response.data]
        }));
      } else {
        setError('Ocurrió un error al agregar la reseña.');
      }
    } catch (error) {
      console.error('Error al agregar la reseña:', error);
      setError('Ocurrió un error al agregar la reseña.');
    }
  };

  if (loading) {
    return <Typography>Cargando...</Typography>;
  }

  if (!beer) {
    return <Typography>No se encontraron detalles para esta cerveza.</Typography>;
  }

  // Separar las reseñas del usuario actual de las reseñas de otros usuarios
  const userReview = beer.reviews.find(review => review.user_id === currentUserId);
  const otherReviews = beer.reviews.filter(review => review.user_id !== currentUserId);

  return (
    <Box
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Typography variant="h4" sx={{ mb: 2 }}>
        Detalles de la Cerveza: {beer.name} 
        {beer.avg_rating ? ` - Rating promedio: ${beer.avg_rating.toFixed(1)} / 5` : ' - No hay reseñas'}
      </Typography>

      <Paper
        elevation={1}
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          bgcolor: 'background.paper',
          textAlign: 'center',
          borderRadius: 1,
          width: '100%',
          maxWidth: 600,
        }}
      >
        <Typography variant="h6">Descripción</Typography>
        <Typography variant="body2" color="text.secondary">
          {beer.description || 'No disponible'}
        </Typography>

        <Typography variant="h6" sx={{ mt: 2 }}>Estilo</Typography>
        <Typography variant="body2" color="text.secondary">
          {beer.style || 'No disponible'}
        </Typography>

        <Typography variant="h6" sx={{ mt: 2 }}>Lúpulo</Typography>
        <Typography variant="body2" color="text.secondary">
          {beer.hop || 'No disponible'}
        </Typography>

        <Typography variant="h6" sx={{ mt: 2 }}>Levadura</Typography>
        <Typography variant="body2" color="text.secondary">
          {beer.yeast || 'No disponible'}
        </Typography>

        <Typography variant="h6" sx={{ mt: 2 }}>Maltas</Typography>
        <Typography variant="body2" color="text.secondary">
          {beer.malts || 'No disponible'}
        </Typography>

        <Typography variant="h6" sx={{ mt: 2 }}>IBU</Typography>
        <Typography variant="body2" color="text.secondary">
          {beer.ibu || 'No disponible'}
        </Typography>

        <Typography variant="h6" sx={{ mt: 2 }}>Alcohol</Typography>
        <Typography variant="body2" color="text.secondary">
          {beer.alcohol || 'No disponible'}
        </Typography>

        <Typography variant="h6" sx={{ mt: 2 }}>BLG</Typography>
        <Typography variant="body2" color="text.secondary">
          {beer.blg || 'No disponible'}
        </Typography>

        <Typography variant="h6" sx={{ mt: 2 }}>Cervecería</Typography>
        <Typography variant="body2" color="text.secondary">
          {beer.brewery ? beer.brewery.name : 'No se encontró cervecería asociada'}
        </Typography>

        <Typography variant="h6" sx={{ mt: 2 }}>Bares que la sirven</Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {beer.bars && beer.bars.length > 0 ? (
            beer.bars.map((bar) => (
              <Grid item xs={12} key={bar.id}>
                <Typography>{bar.name}</Typography>
              </Grid>
            ))
          ) : (
            <Typography>No hay bares disponibles.</Typography>
          )}
        </Grid>

        {/* Sección de reseñas */}
        <Typography variant="h6" sx={{ mt: 2 }}>Reseñas</Typography>

        {/* Mostrar la reseña del usuario actual, si existe */}
        {userReview && (
          <Paper
            elevation={2}
            sx={{ p: 2, my: 1, border: '2px solid', borderColor: 'primary.main', width: '100%', maxWidth: 600 }}
          >
            <Typography variant="body2" color="text.secondary">
              <strong>Tu reseña:</strong> {userReview.text}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Puntuación:</strong> {userReview.rating} / 5
            </Typography>
          </Paper>
        )}

        {/* Mostrar las reseñas de otros usuarios */}
        {otherReviews.length > 0 ? (
          otherReviews.map((review, index) => (
            <Paper
              key={index}
              elevation={1}
              sx={{ p: 2, my: 1, width: '100%', maxWidth: 600 }}
            >
              <Typography variant="body2" color="text.secondary">
                <strong>Puntuación:</strong> {review.rating} / 5
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {review.text}
              </Typography>
            </Paper>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            No hay reseñas disponibles para esta cerveza.
          </Typography>
        )}

        {/* Formulario para agregar reseña */}
        <Typography variant="h6" sx={{ mt: 4 }}>Agregar Reseña</Typography>
        <TextField
          label="Puntuación (1-5)"
          type="number"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Escribe tu reseña"
          multiline
          rows={4}
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddReview}
        >
          Agregar Reseña
        </Button>
        {error && <Typography color="error">{error}</Typography>}
        {successMessage && <Typography color="primary">{successMessage}</Typography>}
      </Paper>
    </Box>
  );
};

export default BeerDetails;
