import React, { useState, useEffect, useContext } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Tab, Tabs, Tooltip, Grid, IconButton, useMediaQuery, useTheme } from "@mui/material";
import GeneralSettings from "./PropertiesParts/GeneralSettings";
import HttpSettings from "./PropertiesParts/HttpSettings";
import WebSettings from "./PropertiesParts/WebSettings";
import OidcSettings from "./PropertiesParts/OidcSettings";
import AppContext from '../../../context/AppContext';
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmationDialog from "../../ConfirmationDialog";
import SettingsIcon from "@mui/icons-material/Settings";
import HttpIcon from "@mui/icons-material/Http";
import WebIcon from "@mui/icons-material/Web";
import OidcIcon from "@mui/icons-material/VerifiedUser";

export default function PublicationPropertiesEdit({ open, publication, onClose }) {
    const [tabIndex, setTabIndex] = React.useState(0);
    const [newPublication, setNewPublication] = useState({
        name: "",
        title: "",
        usr: "",
        pwd: "",
        active: true,
        enable: true,
        enableStandardOData: false,
        httpServices: {
            publishExtensionsByDefault: false,
            publishByDefault: false,
            hsList:[]
        },
        ws: {
            publishExtensionsByDefault: false,
            wsList: []
        }
    });
    const [update, setUpdate] = useState(false);
    const [isGeneralSettingsValid, setIsGeneralSettingsValid] = useState(false);
    const [isHttpSettingsValid, setIsHttpSettingsValid] = useState(false);
    const [isWebSettingsValid, setIsWebSettingsValid] = useState(true);
    const [isAllSettingsValid, setIsAllSettingsValid] = useState(true);
    const { getUniqueTitles, getUniqueEndpoints, addPublication, updatePublication,deletePublication } = useContext(AppContext);
    const uniqueTitles = getUniqueTitles() || [];
    const uniqueEndpoints = getUniqueEndpoints() || [];
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);

    const theme = useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));



    useEffect(() => {
        if (open) {
            setTabIndex(0);
            if (!publication) {
                setNewPublication(
                    {
                        id: "",
                        name: "",
                        title: "",
                        usr: "",
                        pwd: "",
                        active: true,
                        enable: true,
                        enableStandardOData: false,
                        httpServices: {
                            publishExtensionsByDefault: false,
                            publishByDefault: false,
                            hsList: []
                        },
                        ws: {
                            publishExtensionsByDefault: false,
                            wsList:[]
                        },
                    });
                setUpdate(false);
            } else {
                setNewPublication(publication);
                setUpdate(true);
            }
        }

    }, [open]);

    useEffect(() => {
        setIsAllSettingsValid(isHttpSettingsValid && isWebSettingsValid && isGeneralSettingsValid);

   }, [isHttpSettingsValid, isWebSettingsValid, isGeneralSettingsValid]);
    useEffect(() => {
        handleGeneralSettingsValidChange(
            validateTitle(newPublication.title) && validateName(newPublication.name)
        );
    }, [newPublication]);

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    const handleChange = (updatedPublication) => {
        setNewPublication(updatedPublication);
    };

    const handleGeneralSettingsValidChange = (isValid) => {
        setIsGeneralSettingsValid(isValid);
    };

    
    const handleHttpSettingsValidChange = (isValid) => {
        setIsHttpSettingsValid(isValid);
    };

    
    const handleWebSettingsValidChange = (isValid) => {
        setIsWebSettingsValid(isValid);
    };

    const validateTitle = (title) => {
        const otherUniqueTitles = uniqueTitles.filter((t) => t !== newPublication?.title);
        return title && !otherUniqueTitles.includes(title);
      };
      
      const validateName = (name) => {
        const urlPattern = /^[a-zA-Z0-9-_]+$/;
        const otherUniqueEndpoints = uniqueEndpoints.filter((e) => e !== newPublication?.name);
        return name && !otherUniqueEndpoints.includes(name) && urlPattern.test(name);
      };

    const handleSave = () => {
        if (update) {
            updatePublication(publication.id, newPublication);
        } else {
            addPublication(newPublication);
        }
        onClose();
    };

    const handleDeleteConfirmationOpen = () => {
        setConfirmationDialogOpen(true);
    };

    const handleDeleteConfirmationClose = (confirmed) => {
        if (confirmed) {
            deletePublication(publication);
            onClose(null);
        }
        setConfirmationDialogOpen(false);
    };

    return (
        <div>
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>{update ? "Редактирование публикации: " + newPublication.title : "Создать новую публикацию"}</DialogTitle>
            <DialogContent>
            <Tabs value={tabIndex} onChange={handleTabChange}  variant="scrollable" scrollButtons allowScrollButtonsMobile>
                    <Tab icon={<SettingsIcon />} label={isLargeScreen ? "Основные настройки" : ""} />
                    <Tab icon={<HttpIcon />} label={isLargeScreen ? "Http-сервисы" : ""} />
                    <Tab icon={<WebIcon />} label={isLargeScreen ? "Web-сервисы" : ""} />
                    <Tab icon={<OidcIcon />} label={isLargeScreen ? "Настройки OpenID Connect" : ""} />
                </Tabs>
                {newPublication && (
                    <>
                        {tabIndex === 0 && <GeneralSettings publication={newPublication}
                            onChange={handleChange}
                            onValidChange={handleGeneralSettingsValidChange}
                            validateTitle={validateTitle}
                            validateName={validateName}
                        />}
                        {tabIndex === 1 && <HttpSettings publication={newPublication} 
                            onChange={handleChange}  
                            onValidChange={handleHttpSettingsValidChange}/>}
                        {tabIndex === 2 && <WebSettings publication={newPublication}
                            onChange={handleChange} 
                            onValidChange={setIsWebSettingsValid}/>}
                        {tabIndex === 3 && <OidcSettings publication={newPublication}
                             onChange={handleChange} />}
                    </>
                )}
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
                        <Button onClick={onClose}>Отмена</Button>
                    </Grid>
                    <Grid item>
                        <Tooltip
                            title={
                                isAllSettingsValid
                                    ? ""
                                    : "Пожалуйста, исправьте ошибки перед сохранением"
                            }
                        >
                            <span>
                                <Button
                                    onClick={handleSave}
                                    color="primary"
                                    disabled={!isAllSettingsValid}
                                >
                                    Сохранить
                                </Button>
                            </span>
                        </Tooltip>
                    </Grid>
                </Grid>
            </DialogActions >
        </Dialog >
         <ConfirmationDialog
         open={confirmationDialogOpen}
         title="Подтверждение удаления"
         content="Вы уверены, что хотите удалить эту публикацию?"
         onClose={handleDeleteConfirmationClose}
     />
     </div>
    );
}
