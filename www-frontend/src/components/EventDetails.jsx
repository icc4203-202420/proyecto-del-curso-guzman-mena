import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper, Button, Grid, Input, IconButton } from '@mui/material';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attendees, setAttendees] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [images, setImages] = useState([]); // Para almacenar múltiples imágenes
  const [isTakingPhoto, setIsTakingPhoto] = useState(false); // Para controlar cuando se toma una foto
  const videoRef = useRef(null);
  const theme = useTheme();

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
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setErrorMessage('Debes iniciar sesión antes de confirmar tu asistencia.');
      return;
    }
    try {
      const response = await axios.post(`/api/v1/events/${id}/attendances`, {
        user_id: userId
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

  // Manejar la selección de imágenes desde la galería
  const handleImageUpload = (event) => {
    const files = event.target.files;
    const newImages = [...images];
    for (let i = 0; i < files.length; i++) {
      const imageUrl = URL.createObjectURL(files[i]);
      newImages.push({
        url: imageUrl,
        type: files[i].type,
        size: files[i].size
      });
    }
    setImages(newImages);
  };

  // Manejar la toma de fotos con la cámara
  const handleTakePhoto = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setIsTakingPhoto(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
  
      // Espera unos segundos para capturar la imagen
      setTimeout(() => {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
  
        const context = canvas.getContext('2d');
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
  
        // Captura la imagen en formato PNG
        const imageUrl = canvas.toDataURL('image/png');
  
        // Agregar la imagen capturada al estado de imágenes
        setImages(prevImages => [...prevImages, { url: imageUrl, type: 'image/png', size: canvas.width * canvas.height * 4 }]); // Estimación de tamaño
  
        // Detener el flujo de video después de capturar la imagen
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
  
        // Apagar la cámara y limpiar el video
        videoRef.current.srcObject = null;
        setIsTakingPhoto(false);
      }, 3000); // 3 segundos para capturar la imagen
    } catch (error) {
      console.error('Error al acceder a la cámara:', error);
    }
  };

  // Eliminar una imagen de la lista
  const handleDeleteImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  // Subir todas las imágenes seleccionadas
  const handleUploadImages = async () => {
    if (images.length === 0) {
      setErrorMessage('Debes seleccionar o tomar al menos una foto antes de subir.');
      return;
    }
    try {
      const formData = new FormData();
      // Convertir las URLs de imágenes a blobs
      await Promise.all(images.map(async (image, index) => {
        const response = await fetch(image.url);
        const blob = await response.blob();
        formData.append(`image_${index}`, blob, `image_${index}.png`); // Asigna un nombre en formato .png
      }));

      const response = await axios.post(`/api/v1/events/${id}/upload-images`, formData);
      if (response.status === 200) {
        setSuccessMessage('Imágenes subidas con éxito');
        setImages([]); // Limpiar las imágenes después de subir
      } else {
        setErrorMessage('Error al subir imágenes.');
      }
    } catch (error) {
      console.error('Error al subir imágenes:', error);
      setErrorMessage('No se pudo subir las imágenes.');
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

        {/* Botón para seleccionar imágenes */}
        <label htmlFor="image-upload" style={{ cursor: 'pointer' }}>
          <Input
            id="image-upload"
            type="file"
            inputProps={{ multiple: true }}
            onChange={handleImageUpload}
            sx={{ display: 'none' }} // Ocultar el input real
          />
          <Button variant="contained" component="span" sx={{ mt: 2 }}>
            Seleccionar Imágenes
          </Button>
        </label>
        
        <Button
          variant="contained"
          color="secondary"
          onClick={handleTakePhoto}
          sx={{ mt: 2 }}
        >
          Tomar Foto
        </Button>

        {/* Mensajes de error y éxito */}
        {errorMessage && <Typography color="error" sx={{ mt: 2 }}>{errorMessage}</Typography>}
        {successMessage && <Typography color="success.main" sx={{ mt: 2 }}>{successMessage}</Typography>}

        {/* Listado de imágenes seleccionadas */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">Imágenes seleccionadas:</Typography>
          <Grid container spacing={2}>
            {images.map((image, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper sx={{ p: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <img src={image.url} alt={`Selected ${index}`} style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
                  <Typography variant="caption">Tipo: {image.type}</Typography>
                  <Typography variant="caption">Tamaño: {(image.size / 1024).toFixed(2)} KB</Typography>
                  <IconButton onClick={() => handleDeleteImage(index)} aria-label="delete" color="error">
                    <DeleteIcon />
                  </IconButton>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Button variant="contained" color="primary" onClick={handleUploadImages} sx={{ mt: 2 }}>
          Subir Imágenes
        </Button>
      </Paper>

      <video ref={videoRef} style={{ display: isTakingPhoto ? 'block' : 'none', width: '100%', height: 'auto' }} />
    </Box>
  );
};

export default EventDetails;
