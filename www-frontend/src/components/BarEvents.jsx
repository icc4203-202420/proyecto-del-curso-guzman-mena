import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Button } from '@mui/material';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

function BarEvents() {
  const { id } = useParams(); // Obtiene el ID del bar de los parámetros de la URL
  const [bar, setBar] = useState(null); // Almacenar la información del bar
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Para manejar errores

  useEffect(() => {
    const fetchBarAndEvents = async () => {
      try {
        const response = await axios.get(`/api/v1/bars/${id}/events`);
        setBar(response.data.bar || {}); // Asegurarse de que se inicialice como objeto vacío
        setEvents(response.data.events || []); // Asegurarse de que los eventos sean un array vacío si no existen
      } catch (error) {
        console.error('Error fetching bar and events:', error);
        setError('Hubo un problema al cargar los datos.'); // Establecer el mensaje de error
      } finally {
        setLoading(false);
      }
    };

    fetchBarAndEvents();
  }, [id]);

  if (loading) {
    return <Typography>Cargando eventos...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>; // Mostrar mensaje de error si ocurre
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
        {bar.name ? `Eventos del Bar: ${bar.name}` : 'Eventos del Bar'}
      </Typography>

      {bar.address && (
        <Typography variant="body1" sx={{ mb: 2 }} color="text.secondary">
          {`${bar.address.line1}, ${bar.address.city}, ${bar.address.country.name}`}
        </Typography>
      )}

      <Grid container spacing={2} sx={{ maxWidth: 1200 }}>
        {events.length > 0 ? (
          events.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event.id}>
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
                <Typography variant="h6">{event.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {event.description || 'Sin descripción disponible'}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  component={Link}
                  to={`/events/${event.id}`} // Enlace a la vista detallada del evento
                >
                  Ver Detalles
                </Button>
              </Paper>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" color="text.secondary">
            No se encontraron eventos.
          </Typography>
        )}
      </Grid>
    </Box>
  );
}

export default BarEvents;
