import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#212121', // Un gris oscuro
    },
    secondary: {
      main: '#616161', // Un gris medio
    },
    background: {
      default: '#121212', // Fondo negro
      paper: '#1d1d1d',   // Fondo de elementos como Paper y AppBar
    },
    text: {
      primary: '#ffffff',  // Texto principal blanco
      secondary: '#bdbdbd', // Texto secundario gris claro
    },
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
    h1: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '0.875rem',
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.75rem',
      fontWeight: 400,
    },
    button: {
      fontSize: '0.875rem',
      textTransform: 'none', // Evitar que el texto en los botones esté en mayúsculas
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          padding: '6px 12px',
          color: '#ffffff',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1d1d1d', // Color de la barra superior
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1d1d1d', // Fondo de la barra lateral
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#bdbdbd', // Color de los iconos
        },
      },
    },
  },
});

export default theme;
