import React, { useContext, useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import AppContext from "../../../context/AppContext";

const SettingsModal = ({ open, onClose }) => {
  const { state, updateSettings } = useContext(AppContext);
  const [settings, setSettings] = useState(state.settings);
  const [errors, setErrors] = useState({ onecVersion: false });

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const validateOneCVersion = (value) => {
    const pattern = /^8\.3\.\d{2}\.\d{4}$/;
    return pattern.test(value);
  };

  const handleOneCVersionChange = (e) => {
    const { name, value } = e.target;
    const isValid = validateOneCVersion(value);
    setErrors({ ...errors, onecVersion: !isValid });
    handleChange(e);
  };

  const handleSave = () => {
    if (!errors.onecVersion) {
      updateSettings(settings);
      onClose();
    }
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
        <TextField
          label="Версия 1С"
          name="onecVersion"
          value={settings.onecVersion}
          onChange={handleOneCVersionChange}
          fullWidth
          style={{ marginTop: '16px' }}
          error={errors.onecVersion}
          helperText={errors.onecVersion && 'Введите версию 1С в формате 8.3.xx.xxxx'}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Закрыть
        </Button>
        <Button onClick={handleSave} color="primary" disabled={errors.onecVersion}>
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsModal;
