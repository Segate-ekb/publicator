// AppBarMenu.js
import React, { useState, useContext  } from "react";
import { AppBar, Toolbar, IconButton, Button, Menu, Box, Typography, Hidden, Tooltip } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import SettingsModal from "./components/SettingsModal";
import InfoModal from "./components/InfoModal";
import DropdownMenu from "./components/DropdownMenu";
import SettingsEthernetIcon from "@mui/icons-material/SettingsEthernet";
import InfoIcon from "@mui/icons-material/Info";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import ThemeContext from ".//../../ThemeContext";

const AppBarMenu = ({ handleDrawerToggle }) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [serverControlAnchorEl, setServerControlAnchorEl] = useState(null);
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  const handleSettingsOpen = (event) => {
    setSettingsOpen(true);
  };

  const handleSettingsClose = () => {
    setSettingsOpen(false);
  };

  const handleServerControlClick = (event) => {
    setServerControlAnchorEl(event.currentTarget);
  };

  const handleServerControlClose = () => {
    setServerControlAnchorEl(null);
  };

  const handleInfoModalOpen = () => {
    setInfoModalOpen(true);
  };

  const handleInfoModalClose = () => {
    setInfoModalOpen(false);
  };

  return (
    <AppBar position="static" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, Height: (theme) => theme.mixins.toolbar.minHeight }}>
      <Toolbar>
        <Box
          sx={{
            minHeight: (theme) => theme.mixins.toolbar.minHeight,
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerToggle}
            sx={{ display: { sm: "block", md: "none" }, }}
          >
            <MenuIcon />
          </IconButton>
          {darkMode ?
          <img src="/logo_dark.png" alt="Logo" style={{ maxHeight: '55px', marginRight: '8px' }} /> :
          <img src="/logo.png" alt="Logo" style={{ maxHeight: '55px', marginRight: '8px' }} />
}
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Публикатор 1с.
          </Typography>
          <Box sx={{ flexGrow: 1 }} />

          <Button color="inherit" onClick={handleServerControlClick} startIcon={<SettingsEthernetIcon />}>
            <Hidden mdDown>Управление веб-сервером</Hidden>
          </Button>
          <Menu
            anchorEl={serverControlAnchorEl}
            open={Boolean(serverControlAnchorEl)}
            onClose={handleServerControlClose}
          >
            <DropdownMenu />
          </Menu>
          <Button color="inherit" onClick={handleSettingsOpen} startIcon={<SettingsIcon />}>
            <Hidden mdDown>Настройки</Hidden>
          </Button>
          <Button color="inherit" onClick={handleInfoModalOpen} startIcon={<InfoIcon />}>
            <Hidden mdDown>Информация</Hidden>
          </Button>
          <Tooltip title={darkMode ? "Светлая тема" : "Темная тема"}>
            <IconButton onClick={toggleDarkMode} color="inherit">
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Tooltip>
          <SettingsModal open={settingsOpen} onClose={handleSettingsClose} />
          <InfoModal open={infoModalOpen} onClose={handleInfoModalClose} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarMenu;