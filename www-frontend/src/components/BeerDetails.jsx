import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper, Grid } from '@mui/material';
import axios from 'axios';

const BeerDetails = () => {
  const { id } = useParams();
  const [beer, setBeer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBeerDetails = async () => {
      try {
        const response = await axios.get(`/beers/${id}`);
        setBeer(response.data.beer);
        console.log(response.data);  // Verifica los datos obtenidos en la consola
      } catch (error) {
        console.error('Error fetching beer details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBeerDetails();
  }, [id]);

  if (loading) {
    return <Typography>Cargando...</Typography>;
  }

  if (!beer) {
    return <Typography>No se encontraron detalles para esta cerveza.</Typography>;
  }

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
          {beer.description}
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
      </Paper>
    </Box>
  );
};

export default BeerDetails;
