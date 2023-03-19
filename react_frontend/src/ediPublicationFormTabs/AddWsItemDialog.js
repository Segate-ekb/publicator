// AddWsItemDialog.js
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

function AddWsItemDialog({ open, handleClose, handleAddWsItem }) {
  const [name, setName] = useState('');
  const [alias, setAlias] = useState('');

  const handleSave = () => {
    handleAddWsItem({
      name,
      alias,
      enable: true,
      reuseSessions: 'dontuse',
      sessionMaxAge: 20,
      poolSize: 10,
      poolTimeout: 5,
    });
    setName('');
    setAlias('');
    handleClose();
  };

  const handleChange = (event, setter) => {
    setter(event.target.value);
  };

  const isValidName = () => {
    const regex = /^[a-zA-Z0-9-_]+$/;
    return regex.test(name);
  };

  const isValidAlias = () => {
    const regex = /^[a-zA-Z0-9-_.:/]+.1cws$/;
    return regex.test(alias);
  };

  const isFormValid = () => {
    return isValidName() && isValidAlias();
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
              label="Алиас"
              value={alias}
              onChange={(event) => handleChange(event, setAlias)}
              error={!isValidAlias() && alias !== ''}
              helperText={!isValidAlias() && alias !== '' && 'Введите корректный URL.'}
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

export default AddWsItemDialog;