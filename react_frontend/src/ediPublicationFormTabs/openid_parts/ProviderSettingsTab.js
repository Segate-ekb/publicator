import React from 'react';
import { Grid, Typography, TextField } from '@mui/material';

function GeneralSettingsTab({ provider, handleInputChange }) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          name={`issuer`}
          label="Issuer"
          value={provider.providerconfig?.issuer || ''}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          name={`authorization_endpoint`}
          label="Authorization Endpoint"
          value={provider.providerconfig?.authorization_endpoint || ''}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          name={`token_endpoint`}
          label="Token Endpoint"
          value={provider.providerconfig?.token_endpoint || ''}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          name={`jwks_uri`}
          label="JWKS URI"
          value={provider.providerconfig?.jwks_uri || ''}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          name={`userinfo_endpoint`}
          label="Userinfo Endpoint"
          value={provider.providerconfig?.userinfo_endpoint || ''}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          name={`scopes_supported`}
          label="Scopes Supported"
          value={provider.providerconfig?.scopes_supported?.join(', ') || ''}
          onChange={handleInputChange}
        />
      </Grid>
    </Grid>
  );
}

export default GeneralSettingsTab;
