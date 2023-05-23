import React, { useState, useEffect } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Button, Grid, Avatar, FormControlLabel, Switch, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ProviderSettings from './OidcProviders/ProviderSettings';

export default function OidcSettings({ publication, onChange }) {
  const [providers, setProviders] = useState(publication?.oidc?.providers || []);
  const [isProvidersUpdated, setIsProvidersUpdated] = useState(false);
  
  useEffect(() => {
    if (publication?.oidc?.providers) {
      setProviders(publication.oidc.providers);
      setIsProvidersUpdated(true);
    }
  }, [publication]);


  const handleAddProvider = () => {
    const newProvider = {
      providerType: "Other",
      flowId: "default",
      name: "",
      title: "",
      authenticationClaimName: "email",
      authenticationUserPropertyName: "email ",
      image: "",
      discovery: "",
      providerconfig: {
        issuer: "",
        authorization_endpoint: "",
        token_endpoint: "",
        jwks_uri: "",
        userinfo_endpoint: "",
        response_types_supported: ["token id_token"],
        scopes_supported: [
          "openid",
          "email"
        ]
      },
      clientconfig: {
        authority: "",
        client_id: "",
        redirect_uri: "",
        response_type: "token id_token",
        scope: "openid email"
      }


    };
    setProviders([...providers, newProvider]);
    setIsProvidersUpdated(true);
  };

  const handleProviderChange = (index, updatedProvider) => {
    const newProviders = providers.slice();
    newProviders[index] = updatedProvider;
    setProviders(newProviders);
    onChange({ ...publication, oidc: { ...publication.oidc, providers: newProviders } });
  };

  const handleProviderDelete = (index) => {
    const newProviders = providers.filter((_, i) => i !== index);
    setProviders(newProviders);
    onChange({ ...publication, oidc: { ...publication.oidc, providers: newProviders } });
  };

  const handleSwitchChange = (event) => {
    onChange({
      ...publication,
      oidc: {
        ...publication.oidc ?? {},
        [event.target.name]: event.target.checked,
      },
    });
  };

  return (
    <div>
           <FormControlLabel
        control={
          <Switch
            checked={publication?.oidc?.allowStandardAuthentication ?? true}
            onChange={handleSwitchChange}
            name="allowStandardAuthentication"
          />
        }
        label="Разрешить стандартный способ авторизации"
      />
      <Divider />
      <div>OIDC-Провайдеры</div>
      <Grid container direction="column" spacing={2}>
        {isProvidersUpdated &&
          providers.map((provider, index) => (
            <Grid item key={index} xs={12}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  {provider.image && (
                    <Avatar
                      src={provider.image}
                      alt={provider.name}
                      sx={{ marginRight: 1 }}
                    />
                  )}
                  <Typography variant="h6" component="div">
                    {provider.name || 'Новый провайдер'}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ProviderSettings
                    provider={provider}
                    onChange={(updatedProvider) => handleProviderChange(index, updatedProvider)}
                    onDelete={() => handleProviderDelete(index)}
                  />
                </AccordionDetails>
              </Accordion>
            </Grid>
          ))}
        <Grid item>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleAddProvider}
            startIcon={<AddIcon />}
          >
            Добавить сервис
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}