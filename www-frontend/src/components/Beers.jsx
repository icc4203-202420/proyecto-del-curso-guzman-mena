import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Paper, Grid } from '@mui/material';
import axios from 'axios';

const Beers = () => {
  const [beers, setBeers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch beers from the API
    const fetchBeers = async () => {
      try {
        const response = await axios.get('/api/v1/beers'); // Ajusta la URL
        setBeers(response.data.beers);
        console.log(response);
      } catch (error) {
        console.error('Error fetching beers:', error);
      }
    };
    fetchBeers();
  }, []);

  // Filter beers based on search term
  const filteredBeers = beers.filter((beer) =>
    beer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        Lista de Cervezas
      </Typography>
      <TextField
        variant="outlined"
        placeholder="Buscar cervezas..."
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3, width: '100%', maxWidth: 600 }}
      />
      <Grid container spacing={2} sx={{ maxWidth: 1200 }}>
        {filteredBeers.length > 0 ? (
          filteredBeers.map((beer) => (
            <Grid item xs={12} sm={6} md={4} key={beer.id}>
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
                  height: '100%',
                }}
              >
                <Typography variant="h6">{beer.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {beer.description}
                </Typography>
              </Paper>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" color="text.secondary">
            No se encontraron cervezas.
          </Typography>
        )}
      </Grid>
    </Box>
  );
};

export default Beers;
