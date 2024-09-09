import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Typography } from '@mui/material';
import axios from 'axios';

const ReviewForm = ({ beerId, onReviewSubmitted }) => {
  // Esquema de validación para la reseña
  const validationSchema = Yup.object({
    rating: Yup.number()
      .min(1, 'El rating debe ser mayor o igual a 1')
      .max(5, 'El rating debe ser menor o igual a 5')
      .required('El rating es obligatorio'),
    text: Yup.string()
      .min(15, 'La reseña debe tener al menos 15 caracteres')
      .required('La reseña es obligatoria'),
  });

  const handleReviewSubmit = (values, { setSubmitting, resetForm }) => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('Usuario no autenticado');
      return;
    }

    axios.post(`/api/v1/beers/${beerId}/reviews`, {
      review: {
        rating: values.rating,
        text: values.text,
      }
    }, {
      headers: {
        Authorization: token,  // Usar el token almacenado en localStorage
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log('Reseña enviada:', response.data);
      onReviewSubmitted(); // Llama a esta función para refrescar las reseñas
      resetForm(); // Reinicia el formulario
    })
    .catch(error => {
      console.error('Error al enviar la reseña:', error);
    })
    .finally(() => setSubmitting(false));
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6">Escribe tu reseña</Typography>
      <Formik
        initialValues={{ rating: '', text: '' }}
        validationSchema={validationSchema}
        onSubmit={handleReviewSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form>
            <Box mb={2}>
              <Field
                name="rating"
                as={TextField}
                label="Rating (1-5)"
                variant="outlined"
                fullWidth
                error={touched.rating && !!errors.rating}
                helperText={touched.rating && errors.rating}
              />
            </Box>
            <Box mb={2}>
              <Field
                name="text"
                as={TextField}
                label="Reseña"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                error={touched.text && !!errors.text}
                helperText={touched.text && errors.text}
              />
            </Box>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando reseña...' : 'Enviar Reseña'}
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default ReviewForm;
