import React, { useState, useEffect  } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

const AddPublicationForm = ({ open, handleClose, handleAddPublication }) => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [nameError, setNameError] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const [nameErrorText, setNameErrorText] = useState('');
  const [titleErrorText, setTitleErrorText] = useState('');

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setName('');
    setTitle('');
    setNameError(false);
    setTitleError(false);
    setNameErrorText('');
    setTitleErrorText('');
  };

  const validateInput = () => {
    const nameValid = /^[a-zA-Z0-9-_]+$/.test(name) && name.length > 0;
    const titleValid = title.length > 0;

    setNameError(!nameValid);
    setTitleError(!titleValid);

    setNameErrorText(nameValid ? '' : 'Имя должно содержать только латинские символы, цифры и спецсимволы URL');
    setTitleErrorText(titleValid ? '' : 'Название не может быть пустым');

    return nameValid && titleValid;
  };

  const handleSubmit = () => {
    if (validateInput()) {
      handleAddPublication({ name, title });
      handleClose();
    }
  };

  return (
    <Dialog
 open={open}
    onClose={handleClose}
    aria-labelledby="form-dialog-title"
>
    <DialogTitle id="form-dialog-title">Добавить публикацию</DialogTitle>
      <DialogContent>
      <TextField
          margin="dense"
          label="Название публикации"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          error={titleError}
          helperText={titleErrorText}
        />
        <TextField
          autoFocus
          margin="dense"
          label="Корневой url"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          error={nameError}
          helperText={nameErrorText}
        />
      </DialogContent>
      <DialogActions>
      <Button onClick={handleClose} color="primary">
            Отмена
        </Button>
        <Button
            onClick={() => {
                if (handleAddPublication({ name, title })) {
                    handleClose();
                }
            }}
            color="primary"
        >
            Добавить
        </Button>
      </DialogActions>
    </Dialog>
    
  );
};

export default AddPublicationForm;
