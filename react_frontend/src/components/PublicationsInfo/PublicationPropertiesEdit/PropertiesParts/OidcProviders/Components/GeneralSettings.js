import React, { useState, useEffect } from 'react';
import {
    Typography,
    TextField,
    Grid,
    Button,
    Box,
} from '@mui/material';
import { styled } from '@mui/system';
import UploadIcon from '@mui/icons-material/Upload';

const InputImage = styled('input')({
    display: 'none',
});

const ImagePreview = styled('img')({
    maxHeight: '100px',
    maxWidth: '100px',
});

export default function GeneralSettings({ provider, onChange, providers }) {
    const [imagePreview, setImagePreview] = useState(provider.image);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        validate(provider);
    }, [provider]);

    const validate = (provider) => {
        const newErrors = {};
      
        if (!provider.name || provider.name.trim() === '') {
          newErrors.name = 'Name is required';
        } else if (
          providers &&
          providers.some((p) => p.name === provider.name && p !== provider)
        ) {
          newErrors.name = 'Name must be unique';
        }
      
        if (!provider.title || provider.title.trim() === '') {
          newErrors.title = 'Title is required';
        }
      
        if (provider.discovery && !isValidUrl(provider.discovery)) {
          newErrors.discovery = 'Discovery must be a valid URL';
        }
      
        setErrors(newErrors);
      };

    const isValidUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch (_) {
            return false;
        }
    };

    const handleInputChange = (event) => {
        const updatedProvider = {
            ...provider,
            [event.target.name]: event.target.value,
        };
        validate(updatedProvider);
        onChange(updatedProvider);
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result;
                setImagePreview(base64);
                onChange({
                    ...provider,
                    image: base64,
                });
            };
            reader.readAsDataURL(file);
        }
    };


    return (
        <div>
            <Grid container spacing={2} alignItems="center" sx={{ mt: 0.5 }}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        error={Boolean(errors.name)}
                        helperText={errors.name}
                        label="Имя провайдера"
                        name="name"
                        value={provider.name}
                        onChange={handleInputChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        error={Boolean(errors.title)}
                        helperText={errors.title}
                        label="Title"
                        name="title"
                        value={provider.title}
                        onChange={handleInputChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        select
                        label="Authentication User Property Name"
                        value={provider.authenticationUserPropertyName}
                        onChange={handleInputChange}
                        fullWidth
                        name="authenticationUserPropertyName"
                        SelectProps={{
                            native: true,
                        }}
                    >
                        {[
                            {
                                value: 'name',
                                label: 'Имя пользователя',
                            },
                            {
                                value: 'OSUser',
                                label: 'Пользователь ОС',
                            },
                            {
                                value: 'email',
                                label: 'Email пользователя ИБ',
                            },
                            {
                                value: 'matchingKey',
                                label: 'Ключ сопоставления пользователя',
                            }
                        ].map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Authentication Claim Name"
                        name="authenticationClaimName"
                        value={provider.authenticationClaimName}
                        onChange={handleInputChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Box>
                        <InputImage
                            accept="image/*"
                            id="contained-button-file"
                            type="file"
                            onChange={handleImageUpload}
                        />
                        <label htmlFor="contained-button-file">
                            <Button component="span" color="inherit" startIcon={<UploadIcon />}>
                                Загрузить изображение
                            </Button>
                        </label>
                    </Box>
                    {imagePreview && (
                        <ImagePreview
                            src={imagePreview}
                            alt="Предпросмотр изображения"
                        />
                    )}
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        error={Boolean(errors.discovery)}
                        helperText={errors.discovery}
                        label="Discovery"
                        name="discovery"
                        value={provider.discovery}
                        onChange={handleInputChange}
                        fullWidth
                    />
                </Grid>
            </Grid>
        </div>
    );
}