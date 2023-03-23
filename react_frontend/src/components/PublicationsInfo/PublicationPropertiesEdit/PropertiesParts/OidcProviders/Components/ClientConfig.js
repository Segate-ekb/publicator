import React, { useState, useEffect, useCallback } from 'react';
import { TextField, Typography, Grid, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

export default function ClientConfigSettings({ provider = {}, onChange }) {
    const [config, setConfig] = useState({});
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setConfig(provider.clientconfig);
    }, [provider]);

    const validate = useCallback((config) => {
        const newErrors = {};
        ['authority', 'client_id', 'redirect_uri'].forEach(field => {
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
            ...config,
            [event.target.name]: event.target.value,
        };
        validate(updatedConfig);
        onChange({...provider, clientconfig: updatedConfig});
    };

    const handleScopeChange = (event) => {
        const selectedValues = event.target.value;
        const updatedConfig = {
            ...config,
            scope: selectedValues.join(' '),
        };
        validate(updatedConfig);
        onChange({...provider, clientconfig: updatedConfig});
    };

    return (
        <div>
            <Typography variant="h6">Настройки клиента</Typography>
            <Grid container spacing={2} alignItems="center" sx={{ mt: 0.5 }}>
                {['authority', 'client_id', 'redirect_uri'].map((field) => (
                    <Grid item xs={12} sm={6} key={field}>
                        <TextField
                            error={Boolean(errors[field])}
                            helperText={errors[field]}
                            label={field}
                            name={field}
                            value={config[field]}
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
                            value={config.response_type || ''}
                            onChange={handleInputChange}
                            inputProps={{ name: 'response_type', id: 'response_type' }}
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
                            value={config.scope ? config.scope.split(' ') : []}
                            onChange={handleScopeChange}
                            inputProps={{ name: 'scope', id: 'scope' }}
                            multiple={true}
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