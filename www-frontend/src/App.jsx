import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, ListItemIcon, Box } from '@mui/material';
import useLocalStorageState from 'use-local-storage-state';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import MapIcon from '@mui/icons-material/Map';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import theme from './theme';
import Home from './components/Home';
import Beers from './components/Beers';
import BeerDetails from './components/BeerDetails'; // Importamos el componente de detalles de cerveza
import Bars from './components/Bars';
import BarEvents from './components/BarEvents';
import SearchUser from './components/SearchUser';
import SignupForm from './components/SignupForm';  
import LoginForm from './components/LoginForm';

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  // GUARDA EL TOKEN EN LOCAL STORAGE
  const [token, setToken] = useLocalStorageState('WeatherApp/token', {
    defaultValue: '',
  });

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
            {/* Link para buscar usuarios */}
            <ListItem button component={Link} to="/search-user" onClick={toggleDrawer}>
              <ListItemIcon><SearchIcon /></ListItemIcon>
              <ListItemText primary="Search User" />
            </ListItem>

            {/* Link para iniciar sesión */}
            <ListItem button component={Link} to="/login" onClick={toggleDrawer}>
              <ListItemIcon><PersonIcon /></ListItemIcon>
              <ListItemText primary="Iniciar Sesión" />
            </ListItem>

            {/* Link para registrarse */}
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
          <Route path="/beers" element={<Beers />} />               {/* Ruta para ver la lista de cervezas */}
          <Route path="/beers/:id" element={<BeerDetails />} />     {/* Ruta para ver los detalles de una cerveza */}
          <Route path="/bars" element={<Bars />} />
          <Route path="/bars/:id/events" element={<BarEvents />} />
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
