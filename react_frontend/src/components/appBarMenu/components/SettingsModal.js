import React, { useContext, useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import AppContext from "../../../context/AppContext";

const SettingsModal = ({ open, onClose }) => {
  const { state, updateSettings } = useContext(AppContext);
  const [settings, setSettings] = useState(state.settings);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    updateSettings(settings);
    onClose();
  };

  useEffect(() => {
    setSettings(state.settings);
  }, [state.settings]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="settings-dialog-title"
    >
      <DialogTitle id="settings-dialog-title">Настройки</DialogTitle>
      <DialogContent>
        <TextField
          label="Адрес сервера публикации"
          name="publicationServerUrl"
          value={settings.publicationServerUrl}
          onChange={handleChange}
          fullWidth
          style={{ marginTop: '16px' }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Закрыть
        </Button>
        <Button onClick={handleSave} color="primary">
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsModal;