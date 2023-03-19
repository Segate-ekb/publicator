import React from 'react';
import { Grid, Typography, TextField } from '@mui/material';

function ClientSettingsTab({ provider, handleInputChange }) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          name={`client_id`}
          label="Client ID"
          value={provider.clientconfig?.client_id || ''}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          name={`redirect_uri`}
          label="Redirect URI"
          value={provider.clientconfig?.redirect_uri || ''}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          name={`response_type`}
          label="Response Type"
          value={provider.clientconfig?.response_type || ''}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          name={`scope`}
          label="Scope"
          value={provider.clientconfig?.scope || ''}
          onChange={handleInputChange}
        />
      </Grid>
    </Grid>
  );
}

export default ClientSettingsTab;