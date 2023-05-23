import React, { useState } from 'react';
import { Grid, TextField, Switch, FormControlLabel } from '@mui/material';


export default function GeneralSettings({ publication, onChange, onValidChange, validateTitle, validateName }) {
    const [errors, setErrors] = useState({ title: false, name: false });


    const handleChange = (event) => {
        const { name, value, checked } = event.target;

        onChange({
            ...publication,
            [name]: event.target.type === 'checkbox' ? checked : value,
        });

    };

    const handleBlur = (event) => {
        const { name, value } = event.target;
    
        let isValid = true;
        if (name === 'title') {
          isValid = validateTitle(value);
        } else if (name === 'name') {
          isValid = validateName(value);
        }
        setErrors({ ...errors, [name]: !isValid });
    
        // Вызовите колбэк с результатом валидации
        onValidChange(isValid);
      };

    return (
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={10}>
                <TextField
                    label="Название публикации"
                    name="title"
                    value={publication.title}
                    required
                    fullWidth
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.title}
                    helperText={errors.title ? 'Название должно быть уникальным и заполненным' : ''}
                />
            </Grid>
            <Grid item xs={12} sm={2}>
                <FormControlLabel
                    control={
                        <Switch
                            name="active"
                            checked={publication.active}
                            color="primary"
                            onChange={handleChange}
                        />
                    }
                    label="Активна"
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="endpoint публикации"
                    name="name"
                    value={publication.name}
                    required
                    fullWidth
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.name}
                    helperText={errors.name ? 'Endpoint должен быть уникальным, заполненным и содержать только латиницу и допустимые символы URL' : ''}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    label="Имя пользователя"
                    name="usr"
                    value={publication.usr}
                    fullWidth
                    onChange={handleChange}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    label="пароль пользователя"
                    name="pwd"
                    value={publication.pwd}
                    type="password"
                    fullWidth
                    disabled={!publication.usr}
                    onChange={handleChange}
                />
            </Grid>
            <Grid item xs={12}>
                <FormControlLabel
                    control={
                        <Switch
                            name="enable"
                            checked={publication.enable}
                            color="primary"
                            onChange={handleChange}
                        />
                    }
                    label="вход пользователей разрешен"
                />
            </Grid>
            <Grid item xs={12}>
                <FormControlLabel
                    control={
                        <Switch
                            name="enableStandardOData"
                            checked={publication.enableStandardOData}
                            color="primary"
                            onChange={handleChange}
                        />
                    }
                    label="разрешить Odata"
                />
            </Grid>
        </Grid>
    );
}
