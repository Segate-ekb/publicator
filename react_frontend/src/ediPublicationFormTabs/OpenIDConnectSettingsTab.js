import React, { useState } from 'react';
import { Grid, Typography, Accordion, AccordionDetails, AccordionSummary, Tabs, Tab } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GeneralSettingsTab from './openid_parts/GeneralSettingsTab';
import ProviderSettingsTab from './openid_parts/ProviderSettingsTab';
import ClientSettingsTab from './openid_parts/ClientSettingsTab';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Divider from '@mui/material/Divider';
import AddProviderDialog from './openid_parts/AddProviderDialog';

function OpenIDConnectSettingsTab({ editedPublication, handleInputChange }) {
  const [providers, setProviders] = useState(editedPublication?.oidc?.providers || []);
  const [selectedTab, setSelectedTab] = useState(0);
  const [addProviderDialogOpen, setAddProviderDialogOpen] = useState(false);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleAddProvider = (newProvider) => {
    const newProviders = [...providers, newProvider];
    setProviders(newProviders);
    setSelectedTab(0);
    setAddProviderDialogOpen(false);
  };

  const handleDeleteProvider = (providerIndex) => {
    const newProviders = [...providers];
    newProviders.splice(providerIndex, 1);
    setProviders(newProviders);
  };

  const handleProviderChange = (index, newProvider) => {
    const newProviders = [...providers];
    newProviders[index] = newProvider;
    setProviders(newProviders);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          OpenID Connect Settings
        </Typography>
      </Grid>
      {providers && providers.map((provider, index) => (
        <Grid item xs={12} key={index}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel${index}-content`} id={`panel${index}-header`}>
              <Typography>{provider.title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Tabs value={selectedTab} onChange={handleChange}>
                <Tab label="General" />
                <Tab label="Provider" />
                <Tab label="Client" />
              </Tabs>
              selectedTab === 0 && <GeneralSettingsTab provider={provider} handleInputChange={handleInputChange} handleProviderChange={(newProvider) => handleProviderChange(index, newProvider)} />}
{selectedTab === 1 && <ProviderSettingsTab provider={provider} handleInputChange={handleInputChange} handleProviderChange={(newProvider) => handleProviderChange(index, newProvider)} />}
{selectedTab === 2 && <ClientSettingsTab provider={provider} handleInputChange={handleInputChange} handleProviderChange={(newProvider) => handleProviderChange(index, newProvider)} />}
            </AccordionDetails>
            <Divider />
            <IconButton aria-label="delete provider" onClick={() => handleDeleteProvider(index)}>
              <DeleteIcon />
            </IconButton>
          </Accordion>
        </Grid>
      ))}
      <Grid item xs={12}>
        <Fab
          color="primary"
          aria-label="add"
          size="small"
          onClick={() => setAddProviderDialogOpen(true)}
        >
          <AddIcon />
        </Fab>
      </Grid>
      <AddProviderDialog
  open={addProviderDialogOpen}
  handleClose={() => setAddProviderDialogOpen(false)}
  handleAddProvider={handleAddProvider}
/>
    </Grid>
  );
}

export default OpenIDConnectSettingsTab;