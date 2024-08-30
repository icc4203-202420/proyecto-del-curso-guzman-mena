import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function BarEvents() {
  const { id } = useParams(); // Obtiene el ID del bar de los parámetros de la URL
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch events for the specific bar
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`/api/v1/bars/${id}/events`);
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [id]);

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
        Eventos del Bar
      </Typography>
      {loading ? (
        <Typography variant="body1">Cargando eventos...</Typography>
      ) : (
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
                    {event.description}
                  </Typography>
                </Paper>
              </Grid>
            ))
          ) : (
            <Typography variant="body1" color="text.secondary">
              No se encontraron eventos.
            </Typography>
          )}
        </Grid>
      )}
    </Box>
  );
}

export default BarEvents;
