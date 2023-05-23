import React, { useState } from "react";
import {
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Switch,
    FormControlLabel,
    IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmationDialog from "../../../../ConfirmationDialog"

export default function ServiceForm({ service = {}, onChange, onDelete, type }) {
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
    const [nameError, setNameError] = useState(false);
    const [rootUrlError, setRootUrlError] = useState(false);
    const [aliasError, setAliasError] = useState(false);

    const handleInputChange = (event) => {
        onChange({
            ...service,
            [event.target.name]: event.target.value,
        });
    };

    const handleDeleteConfirmationOpen = () => {
        setConfirmationDialogOpen(true);
    };

    const handleDeleteConfirmationClose = (confirmed) => {
        if (confirmed) {
            onDelete(service);
        }
        setConfirmationDialogOpen(false);
    };



    const validateName = (event, value) => {
        if (value.trim() === '') {
            setNameError(true);
            event.preventDefault();
            return false;
        } else {
            setNameError(false);
            return true;
        }
    };


    const validateRootUrl = (event, value) => {
        const pattern = /^[a-zA-Z0-9-_]+$/;
        if (!pattern.test(value)) {
            setRootUrlError(true);
            event.preventDefault();
            return false;
        } else {
            setRootUrlError(false);
            return true;
        }
    };

    const validateAlias = (event, value) => {
        const pattern = /^[a-zA-Z0-9-_]+\.1cws$/;
        if (!pattern.test(value)) {
            setAliasError(true);
            event.preventDefault();
            return false;
        } else {
            setAliasError(false);
            return true;
        }
    };

    return (
        <div>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={9}>
                    <TextField
                        label="Название"
                        name="name"
                        value={service.name}
                        onChange={(event) => {
                                handleInputChange(event);
                        }}
                        onBlur={(event) => validateName(event,service.name)}
                        error={nameError}
                        helperText={nameError ? "Поле обязательно для заполнения" : ""}
                        fullWidth
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <FormControlLabel control={<Switch
                        edge="start"
                        checked={service.enable}
                        onChange={handleInputChange}
                    />} label="Включен" />

                </Grid>
                {type === 'http' && (
                    <Grid item xs={12}>
                        <TextField
                            label="Корневой URL"
                            name="rootUrl"
                            value={service.rootUrl}
                            onChange={(event) => {
                                    handleInputChange(event);
                            }}
                            onBlur={(event) => validateRootUrl(event,service.rootUrl)}
                            error={rootUrlError}
                            helperText={rootUrlError ? "Введите корректный URL" : ""}
                            fullWidth
                            required
                        />
                    </Grid>
                )}

                {type === 'web' && (
                    <Grid item xs={12}>
                        <TextField
                            label="Alias"
                            name="alias"
                            value={service.alias}
                            onChange={(event) => {
                                    handleInputChange(event);
                            }}
                            onBlur={(event) => validateAlias(event, service.alias)}
                            error={aliasError}
                            helperText={aliasError ? "Введите корректный Alias с расширением .1cws" : ""}
                            fullWidth
                            required
                        />
                    </Grid>
                )}
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        label="Pool Size"
                        name="poolSize"
                        type="number"
                        value={service.poolSize}
                        onChange={handleInputChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        label="Pool Timeout"
                        name="poolTimeout"
                        type="number"
                        value={service.poolTimeout}
                        onChange={handleInputChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        label="Session Max Age"
                        name="sessionMaxAge"
                        type="number"
                        value={service.sessionMaxAge}
                        onChange={handleInputChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        select
                        label="Reuse Sessions"
                        value={service.reuseSessions}
                        onChange={handleInputChange}
                        fullWidth
                        name="reuseSessions"
                        SelectProps={{
                            native: true,
                        }}
                    >
                        {[
                            {
                                value: 'dontuse',
                                label: 'Не использовать',
                            },
                            {
                                value: 'use',
                                label: 'Использовать',
                            },
                            {
                                value: 'autouse',
                                label: 'Авто',
                            }
                        ].map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12}>

                    <IconButton onClick={handleDeleteConfirmationOpen} color="secondary">
                        <DeleteIcon />
                    </IconButton>
                </Grid>
            </Grid>
            <ConfirmationDialog
                open={confirmationDialogOpen}
                title="Подтверждение удаления"
                content="Вы уверены, что хотите удалить сервис?"
                onClose={handleDeleteConfirmationClose}
            />
        </div>
    );
}
