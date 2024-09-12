import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper, Button, Grid } from '@mui/material';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attendees, setAttendees] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const theme = useTheme(); // Accede al tema

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const eventResponse = await axios.get(`/api/v1/events/${id}`);
        setEvent(eventResponse.data.event);

        const attendeesResponse = await axios.get(`/api/v1/events/${id}/attendances`);
        setAttendees(attendeesResponse.data.attendees);
      } catch (error) {
        console.error('Error fetching event details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  const handleCheckIn = async () => {
    try {
      const response = await axios.post(`/api/v1/events/${id}/attendances`, {
        user_id: 1 // Asegúrate de que este valor sea dinámico si lo obtienes de algún lugar, como localStorage
      });
  
      if (response.status === 201) {
        setSuccessMessage('¡Has confirmado tu asistencia!');
        
        // Recargar la lista de asistentes después de un check-in exitoso
        const attendeesResponse = await axios.get(`/api/v1/events/${id}/attendances`);
        setAttendees(attendeesResponse.data.attendees);
      } else {
        setErrorMessage('No se pudo confirmar la asistencia.');
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(`Error al hacer check-in: ${error.response.data.error || 'No se pudo procesar la solicitud.'}`);
      } else if (error.request) {
        setErrorMessage('Error al hacer check-in: No se recibió respuesta del servidor.');
      } else {
        setErrorMessage(`Error al hacer check-in: ${error.message}`);
      }
    }
  };

  if (loading) {
    return <Typography>Cargando...</Typography>;
  }

  if (!event) {
    return <Typography>No se encontraron detalles para este evento.</Typography>;
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
        Detalles del Evento: {event.name}
      </Typography>

      <Paper
        elevation={1}
        sx={{
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          bgcolor: 'background.paper',
          textAlign: 'center',
          borderRadius: 1,
          width: '100%',
          maxWidth: 800,
        }}
      >
        <Typography variant="h6">Descripción</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {event.description}
        </Typography>

        <Typography variant="h6">Fecha de Inicio</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {new Date(event.start_date).toLocaleString()}
        </Typography>

        <Typography variant="h6">Fecha de Fin</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {new Date(event.end_date).toLocaleString()}
        </Typography>

        <Typography variant="h6">Asistentes</Typography>
        <Grid container spacing={2} sx={{ maxWidth: 800 }}>
          {attendees.length > 0 ? (
            attendees.map((attendee, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Typography>{attendee.first_name} {attendee.last_name}</Typography>
              </Grid>
            ))
          ) : (
            <Typography>No hay asistentes aún.</Typography>
          )}
        </Grid>

        <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleCheckIn}>
          Confirmar Asistencia
        </Button>

        {errorMessage && (
          <Typography sx={{ mt: 2, fontWeight: 'bold', fontSize: '1.2rem', color: theme.palette.error.main }}>
            {errorMessage}
          </Typography>
        )}
        {successMessage && <Typography color="primary">{successMessage}</Typography>}
      </Paper>
    </Box>
  );
};

export default EventDetails;
