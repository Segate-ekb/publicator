import React, { useEffect } from 'react';
import { FormControlLabel, Switch, Divider } from '@mui/material';
import ServicesArray from "./ServicesArray/ServicesArray";

export default function WebSettings({ publication, onChange, onValidChange }) {
    const handleSwitchChange = (event) => {
        onChange({
            ...publication,
            ws: {
                ...publication.ws,
                [event.target.name]: event.target.checked,
            },
        });
    };

    useEffect(() => {
        const isServicesValid = !publication.ws.wsList ||
        publication.ws.wsList.length === 0 ||
         publication.ws.wsList.every(
            (service) => {
                return (
                    service.name.trim() !== "" &&
                    /^[a-zA-Z0-9-_]+\.1cws$/.test(
                        service.alias
                    )
                );
            }
        );
        onValidChange(isServicesValid);
    }, [publication.ws.wsList, onValidChange]);

    
    const handleServicesChange = (newServices) => {
        onChange({
            ...publication,
            ws: {
                ...publication.ws,
                wsList: newServices,
            },
        });
    };

    return (
        <div>
            <FormControlLabel
                control={
                    <Switch
                        checked={publication.ws.publishExtensionsByDefault}
                        onChange={handleSwitchChange}
                        name="publishExtensionsByDefault"
                    />
                }
                label="Публиковать web-сервисы расширений по умолчанию"
            />
            <Divider />
            <div>Web-сервисы</div>
            <ServicesArray
                type="web"
                servicesList={publication.ws.wsList}
                onChange={handleServicesChange}
            />
        </div>
    );
}