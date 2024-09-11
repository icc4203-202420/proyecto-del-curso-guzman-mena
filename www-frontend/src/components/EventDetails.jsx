import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper, Button, Grid, TextField } from '@mui/material';
import axios from 'axios';

const EventDetails = () => {
  const { id } = useParams(); // ID del evento desde la URL
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attendees, setAttendees] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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
    if (!firstName || !lastName) {
      setErrorMessage('Por favor ingresa tu nombre y apellido.');
      return;
    }

    try {
      const response = await axios.post(`/api/v1/events/${id}/attendances`, {
        user: {
          first_name: firstName,
          last_name: lastName,
        },
      });

      if (response.status === 201) {
        setSuccessMessage('¡Has confirmado tu asistencia!');
        setAttendees([...attendees, { first_name: firstName, last_name: lastName }]); // Añadir al nuevo asistente
        setErrorMessage('');
        setFirstName('');
        setLastName('');
      } else {
        setErrorMessage('No se pudo confirmar la asistencia.');
      }
    } catch (error) {
      setErrorMessage('Error al hacer check-in: ' + error.message);
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

        <Typography variant="h6" sx={{ mt: 4 }}>Confirmar Asistencia</Typography>
        <TextField
          label="Nombre"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Apellido"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleCheckIn}>
          Confirmar Asistencia
        </Button>

        {errorMessage && <Typography color="error">{errorMessage}</Typography>}
        {successMessage && <Typography color="primary">{successMessage}</Typography>}
      </Paper>
    </Box>
  );
};

export default EventDetails;
