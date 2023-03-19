import React, { useState, useEffect } from 'react';
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem, Typography, Box } from '@mui/material';

function GeneralSettingsTab({ provider, handleInputChange, handleProviderChange }) {
  const [name, setName] = useState(provider.name || '');
  const [title, setTitle] = useState(provider.title || '');
  const [authenticationUserPropertyName, setAuthenticationUserPropertyName] = useState(provider.authenticationUserPropertyName || 'email');
  const [authenticationClaimName, setAuthenticationClaimName] = useState(provider.authenticationClaimName || 'email');
  const [imagePreview, setImagePreview] = useState(provider.icon || null);

  useEffect(() => {
    const updatedProvider = {
      ...provider,
      name,
      title,
      authenticationUserPropertyName,
      authenticationClaimName,
      icon: imagePreview
    };
    handleProviderChange(updatedProvider);
  }, [name, title, authenticationUserPropertyName, authenticationClaimName, imagePreview]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField fullWidth label="Name" value={name} onChange={(e) => setName(e.target.value)} />
      </Grid>
      <Grid item xs={12}>
        <TextField fullWidth label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel>Authentication User Property Name</InputLabel>
          <Select value={authenticationUserPropertyName} onChange={(e) => setAuthenticationUserPropertyName(e.target.value)}>
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="OSUser">OSUser</MenuItem>
            <MenuItem value="email">Email</MenuItem>
            <MenuItem value="matchingKey">Matching Key</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <TextField fullWidth label="Authentication Claim Name" value={authenticationClaimName} onChange={(e) => setAuthenticationClaimName(e.target.value)} />
      </Grid>
      <Grid item xs={12}>
        <input accept="image/*" style={{ display: 'none' }} id="icon-upload" type="file" onChange={handleImageChange} />
        <label htmlFor="icon-upload">
          <Typography>Upload Icon</Typography>
        </label>
      </Grid>
      {imagePreview && (
        <Grid item xs={12}>
          <Box>
            <img src={imagePreview} alt="Preview" style={{ width: '100px', height: 'auto' }} />
          </Box>
        </Grid>
      )}
    </Grid>
  );
}

export default GeneralSettingsTab;