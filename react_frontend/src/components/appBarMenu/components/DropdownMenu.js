// components/DropdownMenu.js
import React, { useContext } from "react";
import { MenuItem } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import RefreshIcon from "@mui/icons-material/Refresh";
import AppContext from "../../../context/AppContext";
import { startServer, stopServer, restartServer } from "../../../ApiProcessor";

const DropdownMenu = () => {
  const { showSnackbar } = useContext(AppContext);

  return (
    <>
      <MenuItem onClick={() => startServer(showSnackbar)}>
        <PlayArrowIcon />
        Старт сервера
      </MenuItem>
      <MenuItem onClick={() => stopServer(showSnackbar)}>
        <StopIcon />
        Стоп сервера
      </MenuItem>
      <MenuItem onClick={() => restartServer(showSnackbar)}>
        <RefreshIcon />
        Рестарт сервера
      </MenuItem>
    </>
  );
};

export default DropdownMenu;
