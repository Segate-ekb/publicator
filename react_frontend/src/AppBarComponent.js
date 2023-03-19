import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import RefreshIcon from '@mui/icons-material/Refresh';
import SaveIcon from '@mui/icons-material/Save';
import BuildIcon from '@mui/icons-material/Build';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Menu,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { useBasesData } from './DataContext';
import { restartServer, stopServer, startServer, saveToServer } from './serverManagement';
import ProjectInfoForm from './ProjectInfoForm';
import InfoIcon from '@mui/icons-material/Info';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4caf50',
    },
    secondary: {
      main: '#f44336',
    },
  },
});

export default function AppBarComponent(props) {
  const { handleDrawerToggle } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [operationResult, setOperationResult] = React.useState({ success: true, message: '' });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const { refreshData } = useBasesData();

  const [projectInfoFormOpen, setProjectInfoFormOpen] = React.useState(false);

const handleProjectInfoFormOpen = () => {
  setProjectInfoFormOpen(true);
};

const handleProjectInfoFormClose = () => {
  setProjectInfoFormOpen(false);
};


  const handleRefresh = async () => {
    if (window.confirm('Вы действительно хотите обновить данные из базы?')) {
      await refreshData();
    }
  };

  const handleRestart = async () => {
    const result = await restartServer();
    setOperationResult(result);
    setSnackbarOpen(true);
  };

  const handleStop = async () => {
    const result = await stopServer();
    setOperationResult(result);
    setSnackbarOpen(true);
  };

  const handleStart = async () => {
    const result = await startServer();
    setOperationResult(result);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const [saveDialogOpen, setSaveDialogOpen] = React.useState(false);

  const handleSaveDialogOpen = () => {
    setSaveDialogOpen(true);
  };

  const handleSaveDialogClose = () => {
    setSaveDialogOpen(false);
  };

  const { jsonData } = useBasesData();

  const handleSaveAndClose = async () => {
    const result = await saveToServer(jsonData);
    setOperationResult(result);
    setSnackbarOpen(true);
    if (result.success) {
      setSaveDialogOpen(false); // закрыть диалог, если операция выполнена успешно
    }
  };

  const handleSave = async () => {
    handleSaveDialogOpen();
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar position="fixed" sx={{ height: "64px", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ color: 'inherit' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { xs: "block", sm: "none" }, }}
          >
            <MenuIcon />
          </IconButton>
          <img src="/logo.png" alt="Logo" style={{ maxHeight: '40px', marginRight: '8px' }} />
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Публикатор 1с.
          </Typography>
          <Button color="inherit" onClick={handleRefresh}>
            <RefreshIcon sx={{ mr: 1 }} />
            <Typography component="span" sx={{ display: { xs: "none", lg: "inline" } }}>
              Обновить из базы
            </Typography>
          </Button>
          <Button color="inherit" onClick={handleSave}>
            <SaveIcon sx={{ mr: 1 }} />
            <Typography component="span" sx={{ display: { xs: "none", lg: "inline" } }}>
              Сохранить
            </Typography>
          </Button>

          <Button color="inherit" onClick={handleClick}>
            <BuildIcon sx={{ mr: 1 }} />
            <Typography component="span" sx={{ display: { xs: "none", lg: "inline" } }}>
              Управление Веб-сервером
            </Typography>
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleRestart}>
              <ListItemIcon>
                <RestartAltIcon />
              </ListItemIcon>
              <ListItemText>Перезапустить</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleStart}>
              <ListItemIcon>
                <PlayArrowIcon />
              </ListItemIcon>
              <ListItemText>Запустить</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleStop}>
              <ListItemIcon>
                <StopIcon />
              </ListItemIcon>
              <ListItemText>Остановить</ListItemText>
            </MenuItem>
          </Menu>
          <Button color="inherit" onClick={handleProjectInfoFormOpen}>
  <InfoIcon sx={{ mr: 1 }} />
  <Typography component="span" sx={{ display: { xs: "none", lg: "inline" } }}>
    Информация о проекте
  </Typography>
</Button>
        </Toolbar>
      </AppBar>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={operationResult.success ? 'success' : 'error'} sx={{ width: '100%' }}>
          {operationResult.message}
        </Alert>
      </Snackbar>
      <ProjectInfoForm open={projectInfoFormOpen} onClose={handleProjectInfoFormClose} />
      <Dialog
        open={saveDialogOpen}
        onClose={handleSaveDialogClose}
      >
        <DialogTitle>
          Сохранить данные на сервере
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы действительно хотите сохранить данные на сервере? Это перезапишет текущую конфигурацию.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSaveDialogClose}>
            Отмена
          </Button>
          <Button onClick={handleSaveAndClose} color="primary">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
   
  );
}
