import React, { useState, useEffect, useContext } from "react";
import { IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid, Tooltip, Switch, FormControlLabel } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmationDialog from "../../ConfirmationDialog"
import AppContext from "../../../context/AppContext";

export default function CrsServerEdit({
    open,
    server,
    onClose,
    deleteServer
}) {
    const [newServer, setNewServer] = useState({ tcpAddress: "", name: "", title: "", active: true });
    const [errors, setErrors] = useState({ tcpAddress: "", name: "", title: "" });
    const [update, setUpdate] = useState(false);
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
    const { state } = useContext(AppContext);
    const [isGeneralSettingsValid, setIsGeneralSettingsValid] = useState(false);

    useEffect(() => {
        if (open) {
            if (!server) {
                setNewServer({ tcpAddress: "", name: "", title: "", active: true });
                setUpdate(false);
            } else {
                setNewServer({ ...server, active: server.active !== undefined ? server.active : true });
                setUpdate(true);
            };
        }
    }, [open]);

    useEffect(() => {
        const tcpAddressError = validateTcpAddress(newServer.tcpAddress);
        const nameError = validateName(newServer.name);
        const titleError = validateTitle(newServer.title);

        setErrors({ ...errors, tcpAddress: tcpAddressError, name: nameError, title: titleError });

        handleGeneralSettingsValidChange(
            !tcpAddressError && !nameError && !titleError
        );
    }, [newServer]);

    const handleGeneralSettingsValidChange = (isValid) => {
        setIsGeneralSettingsValid(isValid);
    };

    const handleSave = () => {
        onClose(newServer);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setNewServer({ ...newServer, [name]: value });
    };

    const handleToggleActive = () => {
        setNewServer({ ...newServer, active: !newServer.active });
    };

    const handleDeleteConfirmationOpen = () => {
        setConfirmationDialogOpen(true);
    };

    const handleDeleteConfirmationClose = (confirmed) => {
        if (confirmed) {
            deleteServer(newServer);
            onClose(null);
        }
        setConfirmationDialogOpen(false);
    };

    const validateTcpAddress = (tcpAddress) => {
        try {
            const url = new URL(tcpAddress);
            if (url.protocol !== 'tcp:') {
                return 'TCP address must start with "tcp://" protocol';
            }
        } catch (_) {
            return "TCP address must be a valid URL";
        }
        return "";
    };


    const validateName = (name) => {
        if (!name || !isValidCharacters(name)) {
            return "Сервер может содержать только латиницу, цифры и спецсимволы uri";
        }
        return "";
    };
    const isValidCharacters = (str) => {
        const regex = /^[a-zA-Z0-9-_]+$/;
        return regex.test(str);
    };

    const validateTitle = (title) => {
        if (!title || title.trim().length === 0) {
            return "Представление должно быть заполненно";
        }
        return "";
    };

    return (
        <div>
            <Dialog open={open} onClose={() => onClose(null)}>
                <DialogTitle>{update ? "Изменить настройки публикации хранилища" : "Создать публикацию хранилища"}</DialogTitle>
                <DialogContent>
    <Grid container spacing={2}>
        <Grid item xs={12} sm={8}>
            <TextField
                label="Название сервера"
                name="title"
                value={newServer.title}
                onChange={handleChange}
                fullWidth
                margin="dense"
                required
                onBlur={() => setErrors({ ...errors, title: validateTitle(newServer.title) })}
                error={errors.title !== ""}
                helperText={errors.title}
            />
        </Grid>
        <Grid item xs={12} sm={4}>
            <FormControlLabel
                control={
                    <Switch
                        checked={newServer.active}
                        onChange={handleToggleActive}
                        name="active"
                    />
                }
                label="Активность публикации"
            />
        </Grid>
        <Grid item xs={12}>
            <TextField
                label="Адрес сервера хранилища конфигурации (TCP)"
                name="tcpAddress"
                value={newServer.tcpAddress}
                onChange={handleChange}
                fullWidth
                margin="dense"
                required
                onBlur={() => setErrors({ ...errors, tcpAddress: validateTcpAddress(newServer.tcpAddress) })}
                error={errors.tcpAddress !== ""}
                helperText={errors.tcpAddress}
            />
        </Grid>
        <Grid item xs={12}>
            <TextField
                label="Алиас публикации"
                name="name"
                value={newServer.name}
                onChange={handleChange}
                fullWidth
                margin="dense"
                required
                onBlur={() => setErrors({ ...errors, name: validateName(newServer.name) })}
                error={errors.name !== ""}
                helperText={errors.name}
            />
        </Grid>
    </Grid>
</DialogContent>
                <DialogActions>
                    <Grid container justifyContent="space-between" alignItems="flex-start">
                        {update && (
                            <Grid item>
                                <IconButton onClick={handleDeleteConfirmationOpen} color="secondary">
                                    <DeleteIcon />
                                </IconButton>
                            </Grid>
                        )}
                        <Grid item xs style={{ flexGrow: 1 }} />
                        <Grid item>
                            <Button onClick={() => onClose(null)} color="primary">
                                Cancel
                            </Button>
                        </Grid>
                        <Grid item>
                            <Tooltip
                                title={
                                    isGeneralSettingsValid
                                        ? ""
                                        : "Please fix errors before saving"
                                }
                            >
                                <span>
                                    <Button
                                        onClick={handleSave}
                                        color="primary"
                                        disabled={!isGeneralSettingsValid}
                                    >
                                        Save
                                    </Button>
                                </span>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>
            <ConfirmationDialog
                open={confirmationDialogOpen}
                title="Удалить публикацию"
                content="Вы уверены, что хотите удалить публикацию этого сервера хранилища?"
                onClose={handleDeleteConfirmationClose}
            />
        </div>
    );
}
