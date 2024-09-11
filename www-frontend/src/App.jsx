import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, ListItemIcon, Box } from '@mui/material';
import useLocalStorageState from 'use-local-storage-state';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import MapIcon from '@mui/icons-material/Map';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import theme from './theme';
import Home from './components/Home';
import Beers from './components/Beers';
import BeerDetails from './components/BeerDetails'; 
import Bars from './components/Bars';
import BarEvents from './components/BarEvents';
import EventDetails from './components/EventDetails';  // Import EventDetails
import SearchUser from './components/SearchUser';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userName, setUserName] = useState('Espacio para el nombre del usuario');
  const [token] = useLocalStorageState('token', { defaultValue: '' });

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Efecto para actualizar el nombre de usuario cuando cambia el token
  useEffect(() => {
    const fetchUserName = () => {
      const storedUserName = localStorage.getItem('userName');
      if (storedUserName) {
        setUserName(storedUserName);
      } else {
        setUserName('Espacio para el nombre del usuario'); // Valor inicial si no hay nombre de usuario
      }
    };

    fetchUserName(); // Llama a la función para actualizar el nombre de usuario
  }, [token]); // Dependencia en el token para que el efecto se ejecute al cambiar

  // Función para hacer logout
  const handleLogout = () => {
    localStorage.clear(); // Borra todo el localStorage
    setUserName('Espacio para el nombre de usuario'); // Reiniciar el nombre del usuario
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {/* Barra Superior */}
        <AppBar position="fixed" sx={{ top: 0, left: 0, right: 0 }}>
          <Toolbar>
            <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={toggleDrawer} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              My App
            </Typography>
            <Typography variant="body1" sx={{ marginLeft: 'auto' }}>
              {userName}
            </Typography>
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon /> {/* Icono de Logout */}
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Barra Lateral */}
        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={toggleDrawer}
          ModalProps={{ keepMounted: true }}
        >
          <List>
            <ListItem button component={Link} to="/search-user" onClick={toggleDrawer}>
              <ListItemIcon><SearchIcon /></ListItemIcon>
              <ListItemText primary="Search User" />
            </ListItem>
            <ListItem button component={Link} to="/login" onClick={toggleDrawer}>
              <ListItemIcon><PersonIcon /></ListItemIcon>
              <ListItemText primary="Iniciar Sesión" />
            </ListItem>
            <ListItem button component={Link} to="/signup" onClick={toggleDrawer}>
              <ListItemIcon><PersonIcon /></ListItemIcon>
              <ListItemText primary="Registrarse" />
            </ListItem>
          </List>
        </Drawer>

        {/* Espacio para la Barra Superior */}
        <Toolbar /> 

        {/* Contenido Principal */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/beers" element={<Beers />} />               
          <Route path="/beers/:id" element={<BeerDetails />} />     
          <Route path="/bars" element={<Bars />} />
          <Route path="/bars/:id/events" element={<BarEvents />} />
          <Route path="/events/:id" element={<EventDetails />} />  {/* Ruta para EventDetails */}
          <Route path="/search-user" element={<SearchUser />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/login" element={<LoginForm />} />
        </Routes>

        {/* Barra Inferior */}
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            width: '100%',
            bgcolor: 'primary.main',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            height: '56px',
            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
          }}
        >
          <IconButton color="inherit">
            <PersonIcon />
          </IconButton>
          <IconButton component={Link} to="/" color="inherit">
            <HomeIcon />
          </IconButton>
          <IconButton color="inherit">
            <MapIcon />
          </IconButton>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
