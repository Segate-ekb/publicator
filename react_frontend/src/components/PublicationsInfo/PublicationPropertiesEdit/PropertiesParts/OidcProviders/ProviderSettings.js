import React, { useState } from 'react';
import { Tabs, Tab, Grid, IconButton, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmationDialog from '../../../../ConfirmationDialog';
import GeneralSettings from './Components/GeneralSettings';
import ProviderSettingsTab from './Components/ProviderConfig';
import ClientSettingsTab from './Components/ClientConfig';
import { useMediaQuery } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function ProviderSettings({ provider, onChange, onDelete }) {
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
    const [tabValue, setTabValue] = React.useState(0);
    const matches = useMediaQuery(theme => theme.breakpoints.down('md'));

    const handleInputChange = (event) => {
        onChange({
            ...provider,
            [event.target.name]: event.target.value,
        });
    };

    const handleDeleteConfirmationOpen = () => {
        setConfirmationDialogOpen(true);
    };

    const handleDeleteConfirmationClose = (confirmed) => {
        if (confirmed) {
            onDelete();
        }
        setConfirmationDialogOpen(false);
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleProviderChange = (updatedProviderData) => {
        // Обновите данные провайдера и передайте их в callback
        const updatedProvider = { ...provider, ...updatedProviderData };
        onChange(updatedProvider);
    };

    return (
        <div>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12}>
                    <Box>
                        <Tabs value={tabValue} onChange={handleTabChange}>
                            <Tab icon={<SettingsIcon />} label={!matches && "Общие настройки"} />
                            <Tab icon={<VpnKeyIcon />} label={!matches && "Настройки провайдера"} />
                            <Tab icon={<AccountCircleIcon />} label={!matches && "Настройки клиента"} />
                        </Tabs>
                        {tabValue === 0 && <GeneralSettings provider={provider} onChange={handleProviderChange} />}
                        {tabValue === 1 && <ProviderSettingsTab provider={provider} onChange={handleProviderChange} />}
                        {tabValue === 2 && <ClientSettingsTab provider={provider} onChange={handleProviderChange} />}
                    </Box>
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
                content="Вы уверены, что хотите удалить провайдер?"
                onClose={handleDeleteConfirmationClose}
            />
        </div>
    );
}