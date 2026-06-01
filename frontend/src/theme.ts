import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0f766e', // Verde Esmeralda (Previdência/Estabilidade)
      light: '#14b8a6',
      dark: '#0f172a',
    },
    secondary: {
      main: '#0891b2', // Azul Técnico (Tecnologia/Integração)
      light: '#06b6d4',
      dark: '#1e293b',
    },
    background: {
      default: '#080c10', // Slate profundo
      paper: '#0f1720',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#94a3b8',
    },
    success: {
      main: '#10b981',
    },
    warning: {
      main: '#f59e0b',
    },
    error: {
      main: '#ef4444',
    },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.5px' },
    h2: { fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.5px' },
    h3: { fontSize: '1.75rem', fontWeight: 700 },
    h4: { fontSize: '1.5rem', fontWeight: 600 },
    h5: { fontSize: '1.25rem', fontWeight: 600 },
    h6: { fontSize: '1rem', fontWeight: 600 },
    subtitle1: { fontSize: '0.875rem', fontWeight: 500 },
    body1: { fontSize: '0.875rem', lineHeight: 1.6 },
    body2: { fontSize: '0.75rem', color: '#94a3b8' },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(15, 23, 32, 0.8)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: 16,
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            borderColor: 'rgba(16, 185, 129, 0.2)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 16px',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          '& fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.1)',
          },
          '&:hover fieldset': {
            borderColor: 'rgba(16, 185, 129, 0.3) !important',
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          margin: '2px 0',
          padding: '10px 16px',
          color: '#94a3b8',
          '&.Mui-selected': {
            backgroundColor: 'rgba(15, 118, 110, 0.15)',
            color: '#f8fafc',
            borderLeft: '4px solid #14b8a6',
            '&:hover': {
              backgroundColor: 'rgba(15, 118, 110, 0.25)',
            },
          },
        },
      },
    },
  },
});

export default theme;
