import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
} from '@mui/material';

function AddProviderDialog({ open, handleClose, handleAddProvider, providers }) {
  const [selectedProviderIndex, setSelectedProviderIndex] = useState(0);
  const [newProvider, setNewProvider] = useState({
    name: '',
    title: '',
    authenticationClaimName: 'email',
    authenticationUserPropertyName: 'email',
    icon: '',
  });

  const handleAdd = () => {
    handleAddProvider(newProvider);
    handleClose();
  };

  const handleProviderChange = (event) => {
    setSelectedProviderIndex(event.target.value);
  };

  const handleChange = (event) => {
    setNewProvider({
      ...newProvider,
      [event.target.name]: event.target.value,
    });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProvider({ ...newProvider, icon: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Provider</DialogTitle>
      <DialogContent>
        <form>
          <TextField
            label="Name"
            name="name"
            value={newProvider.name}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Title"
            name="title"
            value={newProvider.title}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Authentication Claim Name"
            name="authenticationClaimName"
            value={newProvider.authenticationClaimName}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Authentication User Property Name</InputLabel>
            <Select
              name="authenticationUserPropertyName"
              value={newProvider.authenticationUserPropertyName}
              onChange={handleChange}
            >
              <MenuItem value="name">name</MenuItem>
              <MenuItem value="OSUser">OSUser</MenuItem>
              <MenuItem value="email">email</MenuItem>
              <MenuItem value="matchingKey">matchingKey</MenuItem>
            </Select>
          </FormControl>
          <Box mb={2}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="icon-upload"
              type="file"
              onChange={handleImageUpload}
            />
            <label htmlFor="icon-upload">
              <Button variant="contained" component="span">
                Upload Icon
              </Button>
            </label>
          </Box>
          {newProvider.icon && (
            <Box mb={2}>
              <img src={newProvider.icon} alt="Provider Icon" style={{ maxHeight: '100px', maxWidth: '100px' }} />
            </Box>      )}
    </form>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose}>Cancel</Button>
    <Button onClick={handleAdd} disabled={!newProvider.name || !newProvider.title}>
      Add
    </Button>
  </DialogActions>
</Dialog>);
}

export default AddProviderDialog;