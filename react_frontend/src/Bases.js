import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { useBasesData } from './DataContext';

const drawerWidth = 360;

export default function BasesOptions(props) {
    const { window } = props;
    const { handleDrawerToggle, mobileOpen } = props;
    const { basesData, setBasesData } = useBasesData();
    const [selectedIndex, setSelectedIndex] = React.useState(1);
    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
        props.setSelectedIndex(index);
    };

    const [open, setOpen] = React.useState(false);
    const [editingItemIndex, setEditingItemIndex] = React.useState(-1);
    const [editedItem, setEditedItem] = React.useState(null);
    const handleClickOpen = (index) => {
        setEditingItemIndex(index);
        setEditedItem(basesData[index]);
        setOpen(true);
    };
    React.useEffect(() => {
        if (basesData.length === 0) {
            setSelectedIndex(null);
        }
    }, [basesData]);
    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = () => {
        const errorMessage = validate(editedItem.name, editedItem.Srvr, editedItem.Ref, editingItemIndex);

        if (errorMessage) {
            alert(errorMessage);
            return;
        }
        const newBasesData = [...basesData];
        newBasesData[editingItemIndex] = editedItem;
        setBasesData(newBasesData);
        setOpen(false);
    };

    const validate = (name, Srvr, Ref, currentIndex) => {
        if (!name.trim() || !Srvr.trim() || !Ref.trim()) {
            return 'Все поля должны быть заполнены';
        }

        if (!isUnique(name, Srvr, Ref, currentIndex)) {
            return 'База с таким наименованием, или парой "Сервер-База на сервере" уже есть';
        }

        return null;
    };
    const isUnique = (name, Srvr, Ref, currentIndex = -1) => {
        let uniqueName = true;
        let uniqueSrvrRef = true;

        const lowerName = name.toLowerCase();
        const lowerSrvr = Srvr.toLowerCase();
        const lowerRef = Ref.toLowerCase();
        basesData.forEach((base, index) => {
            if (index === currentIndex) {
                return;
            }
            if (base.name.toLowerCase() === lowerName) {
                uniqueName = false;
            }

            if (base.Srvr.toLowerCase() === lowerSrvr && base.Ref.toLowerCase() === lowerRef) {
                uniqueSrvrRef = false;
            }
        });
        return uniqueName && uniqueSrvrRef;
    };

    const [addingNewItem, setAddingNewItem] = React.useState(false);
    const handleAddNewItem = () => {
        setEditingItemIndex(-1);
        setEditedItem({ name: "", Srvr: "", Ref: "", active: false });
        setAddingNewItem(true);
    };
    const handleChange = (event, field) => {
        setEditedItem({ ...editedItem, [field]: event.target.value });
    };
    const handleAddClose = () => {
        setAddingNewItem(false);
    };
    const handleAddSave = () => {
        const errorMessage = validate(editedItem.name, editedItem.Srvr, editedItem.Ref);

        if (errorMessage) {
            alert(errorMessage);
            return;
        }

        const newBase = {
            name: editedItem.name,
            Srvr: editedItem.Srvr,
            Ref: editedItem.Ref,
            active: false,
            publications: [
                {
                    name: editedItem.Ref,
                    title: editedItem.name,
                    enable: true,
                    active: false,
                    ws: {
                        publishExtensionsByDefault: true
                    },
                    httpServices: {
                        publishExtensionsByDefault: true,
                        publishByDefault: true
                    }
                }
            ]
        };

        setBasesData([...basesData, newBase]);
        setAddingNewItem(false);
    };

    const [drawerOpen, setDrawerOpen] = React.useState(false);

    const toggleDrawer = (open) => (event) => {
        if (
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }
        setDrawerOpen(open);
    };
    const drawerList = (
        <List
            sx={{
                width: '100%',
                height: '100%',
                maxWidth: 360,
                bgcolor: 'background.paper',
                paddingTop: '64px',
            }}
            subheader={<ListSubheader>Список баз</ListSubheader>}
        >
            {basesData.map((value, index) => {
                const labelId = `checkbox-list-label-${value.name}`;
    
                return (
                    <ListItem
                        key={value.name}
                        secondaryAction={
                            <IconButton
                                edge="end"
                                aria-label="edit"
                                onClick={() => handleClickOpen(index)}
                            >
                                <EditIcon />
                            </IconButton>
                        }
                        disablePadding
                    >
                        <ListItemButton
                            selected={selectedIndex === index}
                            onClick={(event) =>
                                handleListItemClick(event, index)
                            }
                        >
                            <ListItemText id={labelId} primary={value.name} />
                        </ListItemButton>
                    </ListItem>
                );
            })}
            {basesData.length === 0 && (
                <ListItem>
                    <ListItemText primary="Нет доступных баз данных" />
                </ListItem>
            )}
            <Fab
                color="primary"
                aria-label="add"
                onClick={handleAddNewItem}
                sx={{
                    position: 'absolute',
                    bottom: 16,
                    right: 16,
                }}
            >
                <AddIcon />
            </Fab>
        </List>
    );
    const container = window !== undefined ? () => window().document.body : undefined;
    const handleDeleteClick = () => {
        setOpenDeleteConfirmation(true);
    }
    const [openDeleteConfirmation, setOpenDeleteConfirmation] = React.useState(false);
    const handleDeleteConfirmationClose = (deleteConfirmed) => {
        if (deleteConfirmed) {
            const newBasesData = [...basesData];
            newBasesData.splice(editingItemIndex, 1);
            setBasesData(newBasesData);
            setOpenDeleteConfirmation(false);
            handleClose(); // Закрыть диалоговое окно после успешного удаления
        } else {
            setOpenDeleteConfirmation(false);
        }
    }
    return (
        <div>
            <CssBaseline />
            <Box component="main" sx={{ flexGrow: 1, paddingTop: "64px" }}>
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: "block", sm: "none" },
                        width: drawerWidth,
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                    }}
                >
                    {drawerList}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: "none", sm: "block" },
                        width: drawerWidth,
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                    }}
                    open
                >
                    {drawerList}
                </Drawer>
                <Box component="section" sx={{ width: "100%", marginLeft: { sm: `${drawerWidth}px` }, padding: "16px", }}>
                    <Dialog open={open} onClose={handleClose}>
                        <DialogTitle>EditItem</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Внесите изменения в информацию о базе данных
                            </DialogContentText>
                            {editedItem && (
                                <>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        label="Название базы"
                                        type="text"
                                        fullWidth
                                        variant="outlined"
                                        value={editedItem.name}
                                        onChange={(e) => handleChange(e, 'name')}
                                    />
                                    <TextField
                                        margin="dense"
                                        label="Сервер"
                                        type="text"
                                        fullWidth
                                        variant="outlined"
                                        value={editedItem.Srvr}
                                        onChange={(e) => handleChange(e, 'Srvr')}
                                    />
                                    <TextField
                                        margin="dense"
                                        label="Имя базы на сервере"
                                        type="text"
                                        fullWidth
                                        variant="outlined"
                                        value={editedItem.Ref}
                                        onChange={(e) => handleChange(e, 'Ref')}
                                    />
                                </>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleDeleteClick}>Удалить базу</Button>
                            <Button onClick={handleClose}>Отменить</Button>
                            <Button onClick={handleSave}>Сохранить</Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog open={addingNewItem} onClose={handleAddClose}>
                        <DialogTitle>Add New Base</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Заполните информацию о новой базе
                            </DialogContentText>
                            {editedItem && (
                                <>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        label="Название базы"
                                        type="text"
                                        fullWidth
                                        variant="outlined"
                                        value={editedItem.name}
                                        onChange={(e) => handleChange(e, 'name')}
                                    />
                                    <TextField
                                        margin="dense"
                                        label="Сервер"
                                        type="text"
                                        fullWidth
                                        variant="outlined"
                                        value={editedItem.Srvr}
                                        onChange={(e) => handleChange(e, 'Srvr')}
                                    />
                                    <TextField
                                        margin="dense"
                                        label="Имя базы на сервере"
                                        type="text"
                                        fullWidth
                                        variant="outlined"
                                        value={editedItem.Ref}
                                        onChange={(e) => handleChange(e, 'Ref')}
                                    />
                                </>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleAddClose}>Отменить</Button>
                            <Button onClick={handleAddSave}>Сохранить</Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog open={openDeleteConfirmation} onClose={() => handleDeleteConfirmationClose(false)}>
                        <DialogTitle>Delete Base</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Уверены, что хотите удалить базу?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => handleDeleteConfirmationClose(false)}>Отмена</Button>
                            <Button onClick={() => handleDeleteConfirmationClose(true)}>Удалить базу</Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            </Box>
        </div >
    );
}