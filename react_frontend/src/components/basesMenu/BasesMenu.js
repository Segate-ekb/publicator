import React, { useContext, useState } from "react";
import {
  Box,
  Drawer,
  Hidden,
  List,
  ListItem,
  IconButton,
  ListItemButton,
  ListItemText,
  Fab,
  CssBaseline
} from "@mui/material";
import { styled } from "@mui/system";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import AppContext from "../../context/AppContext";
import BaseSettingsEdit from "./components/BaseSettingsEdit";

const drawerWidth = 360;

const AddFab = styled(Fab)(({ theme }) => ({
  position: "absolute",
  bottom: theme.spacing(9),
  right: theme.spacing(2),
}));

export default function BasesMenu(props) {
  const { window } = props;
  const {
    state,
    addBase,
    updateBase,
    deleteBase,
    showSnackbar,
    setSelectedBaseId,
  } = useContext(AppContext);
  const { handleDrawerToggle, mobileOpen } = props;
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingBase, setEditingBase] = useState(null);
  const container = window !== undefined ? () => window().document.body : undefined;

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
            <ListItemText primary="Добаьте первую базу." style={{ marginLeft: "20px" }} />
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
      </List>
      <AddFab color="primary" onClick={() => handleEditDialogOpen()}>
        <AddIcon />
      </AddFab>
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
    </div>
  );
}
