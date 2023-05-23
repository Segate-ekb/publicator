import React, { useState,useEffect } from "react";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Button,
    Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import ServiceForm from "./ServiceForm";

export default function ServicesArray({ servicesList, onChange, type }) {
    const [services, setServices] = useState(servicesList || []);

    const handleAddService = () => {
        setServices([
            ...services, type='http'?
            {
                name: "",
                rootUrl: "",
                enable: true,
                reuseSessions: "dontuse",
                sessionMaxAge: 20,
                poolSize: 10,
                poolTimeout: 5,
            }: {
                name: "",
                alias: "",
                enable: true,
                reuseSessions: "dontuse",
                sessionMaxAge: 20,
                poolSize: 10,
                poolTimeout: 5,
            },
        ]);
    };

    const [isServicesUpdated, setIsServicesUpdated] = useState(false);

    useEffect(() => {
        if (servicesList) {
            setServices(servicesList);
            setIsServicesUpdated(true);
        }
    }, [servicesList]);

    const handleServiceChange = (index, updatedService) => {
        const newServices = services.slice();
        newServices[index] = updatedService;
        setServices(newServices);
        onChange(newServices);
    };

    const handleServiceDelete = (index) => {
        const newServices = services.filter((_, i) => i !== index);
        setServices(newServices);
        onChange(newServices);
    };

    return (
        <Grid container direction="column" spacing={2}>
            {isServicesUpdated && services.map((service, index) => (
                <Grid item key={index}>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                        >
                            <Grid container alignItems="center" spacing={2}>
                                <Grid item xs>
                                    <Typography variant="h6" component="div">
                                        {service.name || "Новый сервис"}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </AccordionSummary>
                        <AccordionDetails>
                            <ServiceForm
                            type = {type}
                                service={service}
                                onChange={(updatedService) =>
                                    handleServiceChange(index, updatedService)
                                }
                                onDelete={() => handleServiceDelete(index)}
                            />
                        </AccordionDetails>
                    </Accordion>
                </Grid>
            ))}
            <Grid item>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleAddService}
                    startIcon={<AddIcon />}
                >
                    Добавить сервис
                </Button>
            </Grid>
        </Grid>
    );
}
