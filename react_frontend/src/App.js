import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import AppBarComponent from './AppBarComponent';
import Content from './Content';
import { DataProvider } from './DataContext';

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://1cdevelopers.ru/">
        1cDevelopers.ru
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function App() {
  const [mobileOpen, setMobileOpen] = React.useState(false);


  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };


  return (
    <DataProvider>

       <AppBarComponent handleDrawerToggle={handleDrawerToggle} />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '99vh',
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
        <Content handleDrawerToggle={handleDrawerToggle} mobileOpen={mobileOpen} />
        </Box>
        <Copyright />
      </Box>
    </DataProvider>
  );
}