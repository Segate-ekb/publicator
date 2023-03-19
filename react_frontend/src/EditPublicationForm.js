// EditPublicationForm.js
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  Tab,
  Tabs,
  TextField,
  FormControlLabel,
  Switch,
  Grid,
} from '@mui/material';

import BasicParametersTab from './ediPublicationFormTabs/BasicParametersTab';
import HttpServicesTab from './ediPublicationFormTabs/HttpServicesTab';
import WebServicesTab from './ediPublicationFormTabs/WebServicesTab';
import OpenIDConnectSettingsTab from './ediPublicationFormTabs/OpenIDConnectSettingsTab';

function EditPublicationForm({ open, handleClose, publicationIndex, publication, handleUpdatePublication, handleDeletePublication}) {
  const [selectedTab, setSelectedTab] = React.useState(0);
  const [editedPublication, setEditedPublication] = useState({ ...publication });
  const [publications, setPublications] = useState([]);

  useEffect(() => {
    setEditedPublication({ ...publication });
  }, [publication]);

  const handleSave = () => {
    handleUpdatePublication(editedPublication);
    handleClose();
  };

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };


  const handleInputChange = (event) => {
    setEditedPublication({
      ...editedPublication,
      [event.target.name]: event.target.value,
    });
  };

  const handleSwitchChange = (event) => {
    setEditedPublication({
      ...editedPublication,
      [event.target.name]: event.target.checked,
    });
  };

  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);

  const onDeletePublication  = () => {
    // вызовите переданную функцию handleDeletePublication с id текущей публикации
    handleDeletePublication(publication);
    // Закройте диалог подтверждения и основной диалог
    setConfirmationDialogOpen(false);
    handleClose();
  };

  const handleConfirmationDialogOpen = () => {
    setConfirmationDialogOpen(true);
  };

  const handleConfirmationDialogClose = () => {
    setConfirmationDialogOpen(false);
  };

  return (
    <>
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Изменить публикацию</DialogTitle>
      <DialogContent>
        <Tabs
          value={selectedTab}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Основные параметры" />
          <Tab label="HTTP-сервисы" />
          <Tab label="Web-сервисы" />
          <Tab label="OpenID Connect Settings" />
        </Tabs>
        {selectedTab === 0 && (<BasicParametersTab editedPublication={editedPublication} handleInputChange={handleInputChange} handleSwitchChange={handleSwitchChange} />)}
        {selectedTab === 1 && <HttpServicesTab editedPublication={editedPublication} setEditedPublication={setEditedPublication} />}
        {selectedTab === 2 && <WebServicesTab editedPublication={editedPublication} setEditedPublication={setEditedPublication} />}
        {selectedTab === 3 && <OpenIDConnectSettingsTab editedPublication={editedPublication} setEditedPublication={setEditedPublication} />}
      </DialogContent>
      <DialogActions>
      <Button onClick={handleConfirmationDialogOpen} color="secondary">
          Удалить публикацию
        </Button>
        <Button onClick={handleClose} color="primary">
          Отменить
        </Button>
        <Button onClick={handleSave} color="primary">
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
        <Dialog open={confirmationDialogOpen}onClose={handleConfirmationDialogClose}>
          <DialogTitle>Удалить публикацию</DialogTitle>
          <DialogContent>
            <DialogContentText>
             Вы уверены, что хотите удалить эту публикацию? Это действие нельзя будет отменить.
           </DialogContentText>
          </DialogContent>
          <DialogActions>
           <Button onClick={handleConfirmationDialogClose} color="primary">
             Отменить
           </Button>
            <Button onClick={onDeletePublication} color="secondary">
             Удалить
            </Button>
          </DialogActions>
        </Dialog>
        </>
  );
}

export default EditPublicationForm;