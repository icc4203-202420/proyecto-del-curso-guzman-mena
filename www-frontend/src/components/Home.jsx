import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Box
      sx={{
        flexGrow: 1,
        height: '100vh',
        p: 3,
        display: 'flex',
        justifyContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Grid container spacing={2} sx={{ maxWidth: 1200 }}>
        {/* Box para Bares */}
        <Grid item xs={12} sm={6} md={4}>
          <Link to="/bars" style={{ textDecoration: 'none' }}>
            <Paper
              elevation={1}
              sx={{
                minHeight: 150,
                minWidth: 250, 
                width: '100%',
                height: '100%',
                maxWidth: 350, 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.paper',
                color: 'text.primary',
                cursor: 'pointer',
                textAlign: 'center',
                borderRadius: 1,
              }}
            >
              <Typography variant="h6">Bares</Typography>
            </Paper>
          </Link>
        </Grid>

        {/* Box para Cervezas */}
        <Grid item xs={12} sm={6} md={4}>
          <Link to="/beers" style={{ textDecoration: 'none' }}>
            <Paper
              elevation={1}
              sx={{
                minHeight: 150,
                minWidth: 250, 
                width: '100%',
                height: '100%',
                maxWidth: 350, 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.paper',
                color: 'text.primary',
                cursor: 'pointer',
                textAlign: 'center',
                borderRadius: 1,
              }}
            >
              <Typography variant="h6">Cervezas</Typography>
            </Paper>
          </Link>
        </Grid>

        {/* Box para Eventos Activos */}
        <Grid item xs={12} sm={6} md={4}>
          <Link to="/bars" style={{ textDecoration: 'none' }}>
            <Paper
              elevation={1}
              sx={{
                minHeight: 150,
                minWidth: 250,
                width: '100%',
                height: '100%',
                maxWidth: 350, 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.paper',
                color: 'text.primary',
                cursor: 'pointer',
                textAlign: 'center',
                borderRadius: 1,
              }}
            >
              <Typography variant="h6">Eventos Activos</Typography>
            </Paper>
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
