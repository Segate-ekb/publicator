import React, { useState, useEffect, useCallback } from 'react';
import { TextField, Typography, Grid, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

export default function ProviderConfigSettings({ provider = {}, onChange }) {
  const [providerConfig, setProviderConfig] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setProviderConfig(provider.providerconfig);
  }, [provider]);

  const validate = useCallback((config) => {
    const newErrors = {};

    ['issuer', 'authorization_endpoint', 'token_endpoint', 'jwks_uri', 'userinfo_endpoint'].forEach(field => {
      if (!config[field] || config[field].trim() === '') {
        newErrors[field] = 'This field is required';
      } else if (!isValidUrl(config[field])) {
        newErrors[field] = 'Must be a valid URL';
      }
    });

    setErrors(newErrors);
  }, []);

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  const OIDC_RESPONSE_TYPES = [
    { value: "code", label: "Code" },
    { value: "id_token", label: "ID Token" },
    { value: "token id_token", label: "Token ID Token" },
    { value: "code id_token ", label: "code id_token " },
    { value: "code token", label: "code token" },
    { value: "code id_token token", label: "code id_token token" },
  ];

  const OIDC_SCOPES = [
    { value: "openid", label: "OpenID" },
    { value: "profile", label: "Profile" },
    { value: "email", label: "Email" },
    { value: "address", label: "Address" },
    { value: "phone", label: "Phone" },
  ];

  const handleInputChange = (event) => {
    const updatedConfig = {
      ...providerConfig,
      [event.target.name]: event.target.value,
    };
    validate(updatedConfig);
    onChange({...provider, providerconfig: updatedConfig});
  };

  return (
    <div>
      <Typography variant="h6">Настройки провайдера</Typography>
      <Grid container spacing={2} alignItems="center" sx={{ mt: 0.5 }}>
        {['issuer', 'authorization_endpoint', 'token_endpoint', 'jwks_uri', 'userinfo_endpoint'].map((field) => (
          <Grid item xs={12} sm={6} key={field}>
            <TextField
              error={Boolean(errors[field])}
              helperText={errors[field]}
              label={field}
              name={field}
              value={providerConfig[field]}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={4} alignItems="center" sx={{ mt: 0.5 }}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel htmlFor="response_type">Response Type</InputLabel>
            <Select
              multiple
              value={providerConfig.response_types_supported || []}
              onChange={handleInputChange}
              inputProps={{ name: 'response_types_supported', id: 'response_types_supported' }}
            >
              {OIDC_RESPONSE_TYPES.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel htmlFor="scope">Scope</InputLabel>
            <Select
              multiple
              value={providerConfig.scopes_supported || []}
              onChange={handleInputChange}
              inputProps={{ name: 'scopes_supported', id: 'scopes_supported' }}
            >
              {OIDC_SCOPES.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </div>
  );
  }