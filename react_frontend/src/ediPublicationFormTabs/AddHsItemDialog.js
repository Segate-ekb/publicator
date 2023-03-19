// AddHsItemDialog.js
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
} from '@mui/material';

function AddHsItemDialog({ open, handleClose, handleAddHsItem }) {
  const [name, setName] = useState('');
  const [rootUrl, setRootUrl] = useState('');

  const handleSave = () => {
    handleAddHsItem({
      name,
      rootUrl,
      enable: true,
      reuseSessions: 'dontuse',
      sessionMaxAge: 20,
      poolSize: 10,
      poolTimeout: 5,
    });
    setName('');
    setRootUrl('');
    handleClose();
  };

  const handleChange = (event, setter) => {
    setter(event.target.value);
  };

  const isValidName = () => {
    const regex = /^[a-zA-Z0-9-_]+$/;
    return regex.test(name);
  };

  const isValidRootUrl = () => {
    const regex = /^[a-zA-Z0-9-_.:/]+$/;
    return regex.test(rootUrl);
  };

  const isFormValid = () => {
    return isValidName() && isValidRootUrl();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Добавить новый элемент</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name"
              value={name}
              onChange={(event) => handleChange(event, setName)}
              error={!isValidName() && name !== ''}
              helperText={!isValidName() && name !== '' && 'Только латинские символы, цифры, дефисы и подчеркивания.'}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Root URL"
              value={rootUrl}
              onChange={(event) => handleChange(event, setRootUrl)}
              error={!isValidRootUrl() && rootUrl !== ''}
              helperText={!isValidRootUrl() && rootUrl !== '' && 'Введите корректный URL.'}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Отменить
        </Button>
        <Button onClick={handleSave} color="primary" disabled={!isFormValid()}>
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddHsItemDialog;