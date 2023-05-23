import React, { useEffect } from 'react';
import { FormControlLabel, Switch, Divider } from '@mui/material';
import ServicesArray from "./ServicesArray/ServicesArray"

export default function HttpSettings({ publication, onChange, onValidChange }) {
    const handleSwitchChange = (event) => {
        onChange({
            ...publication,
            httpServices: {
                ...publication.httpServices,
                [event.target.name]: event.target.checked,
            },
        });
    };

    useEffect(() => {
        const isServicesValid = !publication.httpServices.hsList ||
        publication.httpServices.hsList.length === 0 ||
         publication.httpServices.hsList.every(
            (service) => {
                return (
                    service.name.trim() !== "" &&
                    /^[a-zA-Z0-9-_]+$/.test(
                        service.rootUrl
                    )
                );
            }
        );
        onValidChange(isServicesValid);
    }, [publication.httpServices.hsList, onValidChange]);

    const handleServicesChange = (newServices) => {
        onChange({
            ...publication,
            httpServices: {
                ...publication.httpServices,
                hsList: newServices,
            },
        });
    };

    return (
        <div>
            <FormControlLabel
                control={
                    <Switch
                        checked={publication.httpServices.publishExtensionsByDefault}
                        onChange={handleSwitchChange}
                        name="publishExtensionsByDefault"
                    />
                }
                label="Публиковать http-сервисы расширений по уммолчанию"
            />
            <FormControlLabel
                control={
                    <Switch
                        checked={publication.httpServices.publishByDefault}
                        onChange={handleSwitchChange}
                        name="publishByDefault"
                    />
                }
                label="Публиковать http-сервисы основной конфигурации по умолчанию"
            />
            <Divider />
            <div>HTTP-сервисы</div>
            <ServicesArray
                type="http"
                servicesList={publication.httpServices.hsList}
                onChange={handleServicesChange}
            />
        </div>
    );
}