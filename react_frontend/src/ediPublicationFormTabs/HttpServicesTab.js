// HttpServicesTab.js
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
import AddItemDialog from './AddHsItemDialog';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Divider from '@mui/material/Divider';

function HttpServicesTab({ editedPublication = {
    httpServices: {
        publishExtensionsByDefault: false,
        publishByDefault: false,
        hsList: []
    }
}, setEditedPublication }) {

    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const handleSwitchChange = (event) => {
        setEditedPublication({
            ...editedPublication,
            httpServices: {
                ...editedPublication.httpServices,
                [event.target.name]: event.target.checked,
            },
        });
    };

    const handleAccordionChange = (index, event) => {
        const newHsList = editedPublication.httpServices.hsList.map((item, idx) => {
            if (idx === index) {
                return { ...item, [event.target.name]: event.target.value };
            }
            return item;
        });



        setEditedPublication({
            ...editedPublication,
            httpServices: { ...editedPublication.httpServices, hsList: newHsList },
        });
    };

    const handleAddDialogOpen = () => {
        setAddDialogOpen(true);
    };

    const handleAddDialogClose = () => {
        setAddDialogOpen(false);
    };

    const handleAddHsItem = (newHsItem) => {
        setEditedPublication((prevPublication) => {
            const prevHsList = prevPublication.httpServices?.hsList ?? [];
            return {
                ...prevPublication,
                httpServices: {
                    ...prevPublication.httpServices,
                    hsList: [...prevHsList, newHsItem],
                },
            };
        });
    };


    const handleDeleteHsItem = (index) => {
        const newHsList = editedPublication.httpServices.hsList.filter(
            (_, idx) => idx !== index
        );

        setEditedPublication({
            ...editedPublication,
            httpServices: { ...editedPublication.httpServices, hsList: newHsList },
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
        handleDeleteHsItem(itemToDelete);
        handleDeleteDialogClose();
    };


    return (
        <Box>
            <FormControlLabel
                control={
                    <Switch
                        checked={editedPublication.httpServices.publishExtensionsByDefault}
                        onChange={handleSwitchChange}
                        name="publishExtensionsByDefault"
                    />
                }
                label="Разрешить публиковать http-сервисы расширений по умолчанию"
            />
            <FormControlLabel
                control={
                    <Switch
                        checked={editedPublication.httpServices.publishByDefault}
                        onChange={handleSwitchChange}
                        name="publishByDefault"
                    />
                }
                label="Разрешить публиковать http-сервисы основной конфигурации по умолчанию"
            />
            <Divider textAlign="left">Http-Сервисы</Divider>

            {(editedPublication.httpServices?.hsList ?? []).map((hsItem, index) => (
                <Accordion key={index}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography variant="h4">{hsItem.name}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={2}>
                            <Grid item xs={2} sm={4}>
                                <TextField
                                    label="Наименование"
                                    value={hsItem.name}
                                    name="name"
                                    onChange={(event) => handleAccordionChange(index, event)}
                                    required
                                />
                            </Grid>
                            <Grid item xs={2} sm={4}>
                                <TextField
                                    label="Root URL"
                                    value={hsItem.rootUrl}
                                    name="rootUrl"
                                    onChange={(event) => handleAccordionChange(index, event)}
                                    required
                                />
                            </Grid>
                            <Grid item xs={2} sm={4}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={hsItem.enable}
                                            onChange={() =>
                                                handleAccordionChange(index, { target: { name: 'enable', value: !hsItem.enable } })
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
                                    value={hsItem.reuseSessions}
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
                                    value={hsItem.sessionMaxAge}
                                    name="sessionMaxAge"
                                    onChange={(event) => handleAccordionChange(index, event)}
                                    type="number"
                                />
                            </Grid>
                            <Grid item xs={2} sm={3}>
                                <TextField
                                    label="Pool Size"
                                    value={hsItem.poolSize}
                                    name="poolSize"
                                    onChange={(event) => handleAccordionChange(index, event)}
                                    type="number"
                                />
                            </Grid>
                            <Grid item xs={2} sm={3}>
                                <TextField
                                    label="Pool Timeout"
                                    value={hsItem.poolTimeout}
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
            <AddItemDialog
                open={addDialogOpen}
                handleClose={handleAddDialogClose}
                handleAddHsItem={handleAddHsItem}
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

export default HttpServicesTab;