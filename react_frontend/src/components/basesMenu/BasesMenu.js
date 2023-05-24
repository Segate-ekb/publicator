import React, { useContext, useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  IconButton,
  ListItemButton,
  ListItemText,
  CssBaseline,
  Divider
} from "@mui/material";
import { styled } from "@mui/system";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import StorageIcon from "@mui/icons-material/Storage";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import AppContext from "../../context/AppContext";
import BaseSettingsEdit from "./components/BaseSettingsEdit";
import CrsServerEdit from "./components/CrsServerEdit";

const drawerWidth = 360;

const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
  position: "absolute",
  bottom: theme.spacing(9),
  right: theme.spacing(2),
}));

const CrsList = ({ crs, handleEditDialogOpen }) => {
  const { showSnackbar, state } = useContext(AppContext);


  const handleCopy = async (server) => {
    if (!navigator.clipboard) {
      showSnackbar('Копирование в буфер обмена не поддерживается в вашем браузере.', 'error');
      return;
    }
    
    try {
      const cleanedBaseUrl = state.settings.publicationServerUrl.replace(/\/+$/, ""); // убираем слэши в конце строки
      const cleanedPublicationName = server.name.replace(/^\/+/, ""); 
      const serverAddress = `${cleanedBaseUrl}/${cleanedPublicationName}/repo.1ccr`;
      await navigator.clipboard.writeText(serverAddress);
      showSnackbar('Адрес сервера скопирован в буфер обмена.', 'success');
    } catch (err) {
      showSnackbar('Ошибка при копировании адреса сервера в буфер обмена.', 'error');
    }
  };

  if (crs.length === 0) {
    return (
      <ListItem
        secondaryAction={
          <IconButton
            edge="end"
            aria-label="new"
            onClick={() => handleEditDialogOpen(null)}
          >
            <AddIcon />
          </IconButton>
        }
        disablePadding
      >
        <ListItemText primary="Добавьте сервер хранилища." style={{ marginLeft: "20px" }} />
      </ListItem>
    );
  }

  return crs.map((server) => (
    <ListItem
      key={server.id}
      secondaryAction={
        <IconButton
          edge="end"
          aria-label="edit"
          onClick={() => handleEditDialogOpen(server)}
        >
          <EditIcon />
        </IconButton>
      }
      disablePadding
    >
      <ListItemButton onClick={() => handleCopy(server)}>
        <ListItemText primary={server.title} />
      </ListItemButton>
    </ListItem>
  ));
};

export default function BasesMenu(props) {
  const { window } = props;
  const {
    state,
    addBase,
    updateBase,
    deleteBase,
    addServer,
    updateServer,
    deleteServer,
    showSnackbar,
    setSelectedBaseId,
  } = useContext(AppContext);
  const { handleDrawerToggle, mobileOpen } = props;
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [serverDialogOpen, setServerDialogOpen] = useState(false);
  const [editingBase, setEditingBase] = useState(null);
  const [editingServer, setEditingServer] = useState(null);
  const container = window !== undefined ? () => window().document.body : undefined;
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleServerDialogOpen = (server) => {
    setEditingServer(server);
    setServerDialogOpen(true);
  };

  const handleServerDialogClose = (server) => {
    setServerDialogOpen(false);

    if (server) {
      if (editingServer) {
        updateServer(server);
        showSnackbar("Сервер успешно обновлен", "success");
      } else {
        addServer(server);
        showSnackbar("Сервер успешно добавлен", "success");
      }
    }

    setEditingServer(null);
  };

  const handleEditDialogOpen = (base) => {
    setEditingBase(base);
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = (base) => {
    setEditDialogOpen(false);

    if (base) {
      if (editingBase) {
        updateBase(base);
        showSnackbar("База успешно обновлена", "success");
      } else {
        addBase(base);
        showSnackbar("База успешно добавлена", "success");
      }
    }

    setEditingBase(null);
  };

  const handleListItemClick = (event, id) => {
    setSelectedBaseId(id);
  };

  const actions = [
    { icon: <AddIcon />, name: 'Создать базу', action: () => handleEditDialogOpen(null) },
    { icon: <StorageIcon />, name: 'Создать сервер хранилища', action: () => handleServerDialogOpen(null)}
  ];

  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawerContent = (
    <Box>
      <List>
      <Divider textAlign="left">Базы</Divider>
        {state.bases.length === 0 ? (
          <ListItem secondaryAction={<IconButton
            edge="end"
            aria-label="new"
            onClick={() => handleEditDialogOpen(null)}
          >
            <AddIcon />
          </IconButton>
          }
            disablePadding
          >
            <ListItemText primary="Добавьте первую базу." style={{ marginLeft: "20px" }} />
          </ListItem>
        ) : (
          state.bases.map((base) => (
            <ListItem
              key={base.id}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => handleEditDialogOpen(base)}
                >
                  <EditIcon />
                </IconButton>
              }
              disablePadding
            >
              <ListItemButton
                selected={state.selectedBaseId === base.id}
                onClick={(event) => handleListItemClick(event, base.id)}
              >
                <ListItemText primary={base.name} />
              </ListItemButton>
            </ListItem>
          ))
        )}
        <Divider textAlign="left">Хранилище</Divider>
        <CrsList crs={state.crs} handleEditDialogOpen={handleServerDialogOpen} />
      </List>

      <StyledSpeedDial
        ariaLabel="SpeedDial tooltip example"
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            // tooltipOpen
            onClick={action.action}
          />
        ))}
      </StyledSpeedDial>
    </Box>
  );

  return (
    <div>
      <CssBaseline />
      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", sm: "block", md: "none" },
          width: drawerWidth,
          marginTop: 6,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, marginTop: 8, boxSizing: 'border-box' },
        }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "none", md: "block" },
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, marginTop: 8, boxSizing: 'border-box' },
        }}
        open
      >
        {drawerContent}
      </Drawer>
      <BaseSettingsEdit
        open={editDialogOpen}
        base={editingBase}
        onClose={handleEditDialogClose}
        deleteBase={deleteBase}
      />
      <CrsServerEdit
        open={serverDialogOpen}
        server={editingServer}
        onClose={handleServerDialogClose}
        deleteServer={deleteServer}
      />
    </div>
  );
}
