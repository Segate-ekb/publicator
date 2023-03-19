// WebServicesTab.js
import React, { useState } from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    FormControlLabel,
    Switch,
    Box,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Grid
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import AddWsItemDialog from './AddWsItemDialog';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Divider from '@mui/material/Divider';

function WebServicesTab({ editedPublication, setEditedPublication }) {

    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const handleSwitchChange = (event) => {
        setEditedPublication({
            ...editedPublication,
            ws: {
                ...editedPublication.ws,
                [event.target.name]: event.target.checked,
            },
        });
    };

    const handleAccordionChange = (index, event) => {
        const newWsList = editedPublication.ws.wsList.map((item, idx) => {
            if (idx === index) {
                return { ...item, [event.target.name]: event.target.value };
            }
            return item;
        });

        setEditedPublication({
            ...editedPublication,
            ws: { ...editedPublication.ws, wsList: newWsList },
        });
    };

    const handleAddDialogOpen = () => {
        setAddDialogOpen(true);
    };

    const handleAddDialogClose = () => {
        setAddDialogOpen(false);
    };

    const handleAddWsItem = (newWsItem) => {
        setEditedPublication((prevPublication) => {
            const prevWsList = prevPublication.ws?.wsList ?? [];
            return {
                ...prevPublication,
                ws: {
                    ...prevPublication.ws,
                    wsList: [...prevWsList, newWsItem],
                },
            };
        });
    };

    const handleDeleteWsItem = (index) => {
        const newWsList = editedPublication.ws.wsList.filter(
            (_, idx) => idx !== index
        );

        setEditedPublication({
            ...editedPublication,
            ws: { ...editedPublication.ws, wsList: newWsList },
        });
    };

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const handleDeleteDialogOpen = (index) => {
        setItemToDelete(index);
        setDeleteDialogOpen(true);
    };

    const handleDeleteDialogClose = () => {
        setItemToDelete(null);
        setDeleteDialogOpen(false);
    };

    const handleConfirmDelete = () => {
        handleDeleteWsItem(itemToDelete);
        handleDeleteDialogClose();
    };


    return (
        <Box>
            <FormControlLabel
                control={
                    <Switch
                        checked={editedPublication.ws.publishExtensionsByDefault}
                        onChange={handleSwitchChange}
                        name="publishExtensionsByDefault"
                    />
                }
                label="Разрешить публиковать Web-сервисы расширений по умолчанию"
            />

            <Divider textAlign="left">Web-Сервисы</Divider>
            {(editedPublication.ws?.wsList ?? []).map((wsItem, index) => (
                <Accordion key={index}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography variant="h4">{wsItem.name}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={2}>
                            <Grid item xs={2} sm={4}>
                                <TextField
                                    label="Наименование"
                                    value={wsItem.name}
                                    name="name"
                                    onChange={(event) => handleAccordionChange(index, event)}
                                    required
                                />
                            </Grid>
                            <Grid item xs={2} sm={4}>
                                <TextField
                                    label="Алиас"
                                    value={wsItem.alias}
                                    name="alias"
                                    onChange={(event) => handleAccordionChange(index, event)}
                                    required
                                />
                            </Grid>
                            <Grid item xs={2} sm={4}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={wsItem.enable}
                                            onChange={() =>
                                                handleAccordionChange(index, { target: { name: 'enable', value: !wsItem.enable } })
                                            }
                                            name="enable"
                                        />
                                    }
                                    label="Использование"
                                />
                            </Grid>
                            <Grid item xs={2} sm={3}>
                                <TextField
                                    select
                                    label="Reuse Sessions"
                                    value={wsItem.reuseSessions}
                                    onChange={(event) => handleAccordionChange(index, event)}
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
                            <Grid item xs={2} sm={3}>
                                <TextField
                                    label="Session Max Age"
                                    value={wsItem.sessionMaxAge}
                                    name="sessionMaxAge"
                                    onChange={(event) => handleAccordionChange(index, event)}
                                    type="number"
                                />
                            </Grid>
                            <Grid item xs={2} sm={3}>
                                <TextField
                                    label="Pool Size"
                                    value={wsItem.poolSize}
                                    name="poolSize"
                                    onChange={(event) => handleAccordionChange(index, event)}
                                    type="number"
                                />
                            </Grid>
                            <Grid item xs={2} sm={3}>
                                <TextField
                                    label="Pool Timeout"
                                    value={wsItem.poolTimeout}
                                    name="poolTimeout"
                                    onChange={(event) => handleAccordionChange(index, event)}
                                    type="number"
                                />
                            </Grid>
                            <Grid item xs={12} textAlign="right">
                                <IconButton
                                    edge="end"
                                    color="inherit"
                                    onClick={() => handleDeleteDialogOpen(index)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            ))}
            <Fab
                color="inherit"
                aria-label="add"
                size="small"
                onClick={handleAddDialogOpen}
                sx={{
                    position: 'relative',
                    top: 10,
                    left: 800,

                }}
            >
                <AddIcon />
            </Fab>
            <AddWsItemDialog
                open={addDialogOpen}
                handleClose={handleAddDialogClose}
                handleAddWsItem={handleAddWsItem}
            />
            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteDialogClose}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>Подтверждение удаления</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Вы уверены, что хотите удалить данный элемент?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>

                    <Button onClick={handleDeleteDialogClose} color="primary">
                        Отменить
                    </Button>
                    <Button onClick={handleConfirmDelete} color="primary" autoFocus>
                        Удалить
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default WebServicesTab;