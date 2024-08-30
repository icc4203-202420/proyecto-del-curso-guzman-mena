import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Paper, Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Bars = () => {
  const [bars, setBars] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate(); // Hook para la navegación

  useEffect(() => {
    // Fetch bars from the API
    const fetchBars = async () => {
      try {
        const response = await axios.get('/api/v1/bars'); // Ajusta la URL
        setBars(response.data.bars);
        console.log(response);
      } catch (error) {
        console.error('Error fetching bars:', error);
      }
    };
    fetchBars();
  }, []);

  // Filter bars based on search term
  const filteredBars = bars.filter((bar) =>
    bar.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle button click
  const handleBarClick = (barId) => {
    navigate(`${barId}/events`); // Redirige a la página de eventos del bar
  };

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
        Lista de Bares
      </Typography>
      <TextField
        variant="outlined"
        placeholder="Buscar bares..."
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3, width: '100%', maxWidth: 600 }}
      />
      <Grid container spacing={2} sx={{ maxWidth: 1200 }}>
        {filteredBars.length > 0 ? (
          filteredBars.map((bar) => (
            <Grid item xs={12} sm={6} md={4} key={bar.id}>
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
                <Typography variant="h6">{bar.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {bar.description}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleBarClick(bar.id)} // Función de clic
                  sx={{ mt: 2 }}
                >
                  Ver Eventos
                </Button>
              </Paper>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" color="text.secondary">
            No se encontraron bares.
          </Typography>
        )}
      </Grid>
    </Box>
  );
};

export default Bars;
