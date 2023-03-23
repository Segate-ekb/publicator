import React, { useState, useEffect, useContext  } from "react";
import { IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid, Tooltip  } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmationDialog from "../../ConfirmationDialog"
import AppContext from "../../../context/AppContext";

export default function BaseSettingsEdit({
    open,
    base,
    onClose,
    deleteBase
}) {
    const [newBase, setNewBase] = useState({name: "", srvr: "", ref: "" });
    const [errors, setErrors] = useState({ name: "", srvr: "", ref: "" });
    const [update, setUpdate] = useState(false);
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
    const { state } = useContext(AppContext);
    const [isGeneralSettingsValid, setIsGeneralSettingsValid] = useState(false);

    useEffect(() => {
        if (open) {
            if (!base) {
                setNewBase({name: "", srvr: "", ref: "" });
                setUpdate(false);
            } else {
                setNewBase(base);
                setUpdate(true);
            };
        }
    }, [open]);

        // Добавьте новый useEffect с зависимостью от состояния newPublication
        useEffect(() => {
            const nameError = validateName(newBase.name);
            const srvrRefError = validateSrvrRef(newBase.ref, newBase.srvr);
            const srvrError = validateServer(newBase.srvr);
            const refError = validateRef(newBase.ref);

            setErrors({ ...errors, name: nameError, srvr: !srvrError ? srvrRefError : srvrError, ref: !refError ? srvrRefError : srvrError});

            handleGeneralSettingsValidChange(
               !nameError && !srvrError && !refError
            );
        }, [newBase]);

        const handleGeneralSettingsValidChange = (isValid) => {
            setIsGeneralSettingsValid(isValid);
        };


    const handleSave = () => {

          onClose(newBase);

      };





    const handleChange = (event) => {
        const { name, value } = event.target;
        setNewBase({ ...newBase, [name]: value });

    };

    const handleDeleteConfirmationOpen = () => {
        setConfirmationDialogOpen(true);
    };

    const handleDeleteConfirmationClose = (confirmed) => {
        if (confirmed) {
            deleteBase(newBase);
            onClose(null);
        }
        setConfirmationDialogOpen(false);
    };

    const isValidCharacters = (str) => {
        const regex = /^[a-zA-Z0-9-_]+$/;
        return regex.test(str);
    };
    
  const validateBase = (base, field) => {
    

    if (field) {
      if (field === "name") {
        return base[field].trim().length > 0 && isNameUnique(base[field]);
      } else if (field === "ref" || field === "srvr") {
        return base[field].trim().length > 0 && isRefSrvrUnique(base.ref, base.srvr);
      }
    } else {
      return (
        base.name.trim().length > 0 &&
        base.srvr.trim().length > 0 &&
        base.ref.trim().length > 0 &&
        isNameUnique(base.name) &&
        isRefSrvrUnique(base.ref, base.srvr)
      );
    }
  };

  const isNameUnique = (name) => {
    return !state.bases.some((b) => (!base || b.id !== base.id) && b.name === name);
  };
  
  const isRefSrvrUnique = (ref, srvr) => {
    return !state.bases.some((b) => (!base || b.id !== base.id) && b.ref === ref && b.srvr === srvr);
  };

  const validateName = (name) => {
    if (!isNameUnique(name)) {
      return "Введите уникальное название базы";
    }
    return "";
  };
  
  const validateSrvrRef = (ref, srvr) => {
    if (!isRefSrvrUnique(ref, srvr)) {
      return "Введите уникальное сочетание сервера и имени базы на сервере";
    }
    return "";
  };

    const validateServer = (srvr) => {
        if (!isValidCharacters(srvr)) {
            return "Сервер может содержать только латиницу, цифры и спецсимволы uri";
        }
        return "";
    };
    
    const validateRef = (ref) => {
        if (!isValidCharacters(ref)) {
            return "Имя базы на сервере может содержать только латиницу, цифры и спецсимволы uri";
        }
        return "";
    };

    return (
        <div>
            <Dialog open={open} onClose={() => onClose(null)}>
                <DialogTitle>{update ? "Редактировать базу" : "Добавить базу"}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Название базы"
                        name="name"
                        value={newBase.name}
                        onChange={handleChange}
                        fullWidth
                        margin="dense"
                        required
                        onBlur={() => setErrors({ ...errors, name: validateName(newBase.name) })}
                        error={!validateBase(newBase, "name")}
                        helperText={errors.name}
                    />
                    <TextField
                        label="Сервер"
                        name="srvr"
                        value={newBase.srvr}
                        onChange={handleChange}
                        fullWidth
                        margin="dense"
                        required
                        onBlur={() =>
                            setErrors({ ...errors, srvr: validateServer(newBase.srvr), ref: validateSrvrRef(newBase.ref, newBase.srvr) })}                        
                        error={!validateBase(newBase, "srvr")}
                        helperText={errors.srvr}
                    />
                    <TextField
                        label="Имя базы на сервере"
                        name="ref"
                        value={newBase.ref}
                        onChange={handleChange}
                        fullWidth
                        margin="dense"
                        required
                        onBlur={() =>
                            setErrors({ ...errors, srvr: validateRef(newBase.ref), ref: validateSrvrRef(newBase.ref, newBase.srvr) })}
                        
                        error={!validateBase(newBase, "ref")}
                        helperText={errors.ref}
                    />
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
                                Отмена
                            </Button>
                        </Grid>
                        <Grid item>
                        <Tooltip
                            title={
                                isGeneralSettingsValid
                                    ? ""
                                    : "Пожалуйста, исправьте ошибки перед сохранением"
                            }
                        >
                            <span>
                                <Button
                                    onClick={handleSave}
                                    color="primary"
                                    disabled={!isGeneralSettingsValid}
                                >
                                    Сохранить
                                </Button>
                            </span>
                        </Tooltip>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>
            <ConfirmationDialog
                open={confirmationDialogOpen}
                title="Подтверждение удаления"
                content="Вы уверены, что хотите удалить эту базу?"
                onClose={handleDeleteConfirmationClose}
            />
        </div>
    );
}