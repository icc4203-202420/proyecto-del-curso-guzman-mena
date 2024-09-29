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
  const [uploadedImages, setUploadedImages] = useState([]); // Imágenes ya subidas
  const [newImages, setNewImages] = useState([]); // Imágenes que seleccionas pero aún no has subido
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const videoRef = useRef(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const eventResponse = await axios.get(`/api/v1/events/${id}`);
        const eventData = eventResponse.data.event;

        setEvent(eventData);

        // Si el evento tiene imágenes, las establecemos, si no, dejamos el arreglo vacío
        setUploadedImages(eventData.images || []); 

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
    const selectedImages = [...newImages];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      selectedImages.push({
        file,  // Almacena el archivo real
        url: URL.createObjectURL(file),  // Para previsualizar la imagen
        type: file.type,
        size: file.size
      });
    }
  
    setNewImages(selectedImages);
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
  
      setTimeout(() => {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
  
        const context = canvas.getContext('2d');
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
  
        const imageUrl = canvas.toDataURL('image/png');
  
        setNewImages((prevImages) => [...prevImages, { url: imageUrl, type: 'image/png' }]);

        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
  
        videoRef.current.srcObject = null;
        setIsTakingPhoto(false);
      }, 3000);
    } catch (error) {
      console.error('Error al acceder a la cámara:', error);
    }
  };

  // Eliminar una imagen de la lista de nuevas imágenes
  const handleDeleteImage = (index) => {
    const updatedNewImages = newImages.filter((_, i) => i !== index);
    setNewImages(updatedNewImages);
  };

  // Subir todas las imágenes seleccionadas
  const handleUploadImages = async () => {
    if (newImages.length === 0) {
      setErrorMessage('Debes seleccionar o tomar al menos una foto antes de subir.');
      return;
    }
    try {
      const formData = new FormData();
      newImages.forEach((image, index) => {
        if (image.file) {
          formData.append('images[]', image.file, `image_${index}.png`);
        }
      });
  
      const response = await axios.post(`/api/v1/events/${id}/upload_images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      if (response.status === 200) {
        setSuccessMessage('Imágenes subidas con éxito');
        setNewImages([]); // Limpiar las imágenes seleccionadas
        setUploadedImages((prevImages) => [...prevImages, ...newImages]); // Agregar las nuevas imágenes subidas
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

        {/* Sección para las imágenes ya subidas */}
        <Box sx={{ mt: 4, width: '100%' }}>
          <Typography variant="h6">Imágenes del Evento</Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {uploadedImages.length > 0 ? (
              uploadedImages.map((image, index) => (
                <Grid item xs={12} sm={4} key={index}>
                  <img src={image.url || image} alt={`Imagen ${index + 1}`} style={{ width: '100%', borderRadius: '8px' }} />
                </Grid>
              ))
            ) : (
              <Typography>No hay imágenes disponibles.</Typography>
            )}
          </Grid>
        </Box>

        {/* Sección para imágenes nuevas seleccionadas pero aún no subidas */}
        <Box sx={{ mt: 4, width: '100%' }}>
          <Typography variant="h6">Imágenes seleccionadas para subir</Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {newImages.length > 0 ? (
              newImages.map((image, index) => (
                <Grid item xs={12} sm={4} key={index}>
                  <Paper sx={{ p: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <img src={image.url} alt={`Selected ${index}`} style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
                    <Typography variant="caption">Tipo: {image.type}</Typography>
                    <Typography variant="caption">Tamaño: {(image.size / 1024).toFixed(2)} KB</Typography>
                    <IconButton onClick={() => handleDeleteImage(index)} aria-label="delete" color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Paper>
                </Grid>
              ))
            ) : (
              <Typography></Typography>
            )}
          </Grid>
        </Box>

        {/* Botones para subir y seleccionar imágenes */}
        <Button variant="contained" color="primary" onClick={handleUploadImages} sx={{ mt: 2 }}>
          Subir Imágenes
        </Button>

        <label htmlFor="image-upload" style={{ cursor: 'pointer' }}>
          <Input
            id="image-upload"
            type="file"
            inputProps={{ multiple: true }}
            onChange={handleImageUpload}
            sx={{ display: 'none' }}
          />
          <Button variant="contained" component="span" sx={{ mt: 2 }}>
            Seleccionar Imágenes
          </Button>
        </label>

        <Button variant="contained" color="secondary" onClick={handleTakePhoto} sx={{ mt: 2 }}>
          Tomar Foto
        </Button>
      </Paper>

      <video ref={videoRef} style={{ display: isTakingPhoto ? 'block' : 'none', width: '100%', height: 'auto' }} />
    </Box>
  );
};

export default EventDetails;
