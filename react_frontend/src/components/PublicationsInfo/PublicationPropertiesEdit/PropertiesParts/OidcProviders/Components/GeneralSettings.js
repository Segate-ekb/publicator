import React, { useState, useEffect, useContext  } from 'react';
import {
    Typography,
    TextField,
    Grid,
    Button,
    Box,
} from '@mui/material';
import { styled } from '@mui/system';
import UploadIcon from '@mui/icons-material/Upload';
import { ProvidersTemplate } from './ProvidersTemplate';
import ConfirmationDialog from '../../../../../ConfirmationDialog';
import AppContext from "../../../../../../context/AppContext";

const InputImage = styled('input')(({ providerId }) => ({
    display: 'none',
    id: `contained-button-file-${providerId}`,
}));

const ImagePreview = styled('img')({
    maxHeight: '100px',
    maxWidth: '100px',
});

export default function GeneralSettings({ provider, onChange, providers }) {
    const { state } = useContext(AppContext);
    const [imagePreview, setImagePreview] = useState(provider.image);
    const [errors, setErrors] = useState({});
    const [selectedProvider, setSelectedProvider] = useState(
        ProvidersTemplate.find((templateGroup) => templateGroup.providerType === provider.providerType)
    );
    const [selectedFlow, setSelectedFlow] = useState(null);
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);

    useEffect(() => {
        validate(provider);
        setImagePreview(provider.image);
    }, [provider]);

    useEffect(() => {
        if (provider.flowid && selectedProvider) {
            setSelectedFlow(provider.flowId);
        }
    }, [provider, selectedProvider]);

    useEffect(() => {
        if (selectedFlow) {
            handleFlowSelect(selectedFlow);
        }
    }, [selectedFlow]);

    const validate = (provider) => {
        const newErrors = {};

        if (!provider.name || provider.name.trim() === '') {
            newErrors.name = 'Name is required';
        } else if (
            providers &&
            providers.some((p) => p.name === provider.name && p !== provider)
        ) {
            newErrors.name = 'Name must be unique';
        }

        if (!provider.title || provider.title.trim() === '') {
            newErrors.title = 'Title is required';
        }

        if (provider.discovery && !isValidUrl(provider.discovery)) {
            newErrors.discovery = 'Discovery must be a valid URL';
        }

        setErrors(newErrors);
    };

    const isValidUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch (_) {
            return false;
        }
    };

    const handleInputChange = (event) => {
        const updatedProvider = {
            ...provider,
            [event.target.name]: event.target.value,
        };
        validate(updatedProvider);
        onChange(updatedProvider);
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result;
                setImagePreview(base64);
                onChange({
                    ...provider,
                    image: base64,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const [pendingProviderType, setPendingProviderType] = useState(null);
    const [pendingFlowId, setPendingFlowId] = useState(null);

    const handleProviderSelect = (providerType) => {
        const selectedProvider = ProvidersTemplate.find(
            (templateGroup) => templateGroup.providerType === providerType
        );

        if (
            (provider.flowId && provider.providerType !== providerType) ||
            (selectedProvider &&
                selectedProvider.flows &&
                selectedProvider.flows.length &&
                provider.flowId &&
                provider.flowId !== selectedProvider.flows[0].id)
        ) {
            // If changing provider or flow, prompt for confirmation
            setPendingProviderType(providerType);
            setPendingFlowId(null);
            setConfirmationDialogOpen(true);
        } else {
            // Otherwise, update provider state immediately
            setSelectedProvider(selectedProvider);
            if (selectedProvider && selectedProvider.flows) {
                const initialFlow =
                    selectedProvider.flows.find((flow) => flow.id === provider.flowId) ||
                    selectedProvider.flows[0];
                setSelectedFlow(initialFlow.id);
            } else {
                setSelectedFlow(null);
            }
            onChange({
                ...provider,
                providerType,
                flowId: null,
            });
        }
    };

    const handleFlowSelect = (flowId) => {
        if (!selectedProvider) return;

        if (provider.flowId !== flowId) {
            // If changing flow, prompt for confirmation
            setPendingProviderType(null);
            setPendingFlowId(flowId);
            setConfirmationDialogOpen(true);
        } else {
            // Otherwise, update provider state immediately
            const selectedFlow = selectedProvider.flows.find((flow) => flow.id === flowId);
            setSelectedFlow(flowId);

            if (selectedFlow) {
                onChange({
                    ...provider,
                    flowId,
                    ...selectedFlow.settingsTemplate,
                });
            } else {
                onChange({
                    ...provider,
                    flowId: null,
                });
            }
        }
    };

    const handleDeleteConfirmationClose = (confirmed) => {
        if (confirmed) {
            // If user confirmed the dialog, update provider state
            if (pendingProviderType !== null) {
                const selectedProvider = ProvidersTemplate.find(
                    (templateGroup) => templateGroup.providerType === pendingProviderType
                );
                setSelectedProvider(selectedProvider);
                if (selectedProvider && selectedProvider.flows) {
                    const initialFlow = selectedProvider.flows[0];
                    setSelectedFlow(initialFlow.id);
                    onChange({
                        ...provider,
                        providerType: pendingProviderType,
                        flowId: initialFlow.id,
                        ...initialFlow.settingsTemplate,
                    });
                } else {
                    setSelectedFlow(null);
                    onChange({
                        ...provider,
                        providerType: pendingProviderType,
                        flowId: null,
                    });
                }
            } else {
                const selectedFlow = selectedProvider.flows.find((flow) => flow.id === pendingFlowId);
                setSelectedFlow(pendingFlowId);
                if (selectedFlow) {
                    onChange({
                        ...provider,
                        flowId: pendingFlowId,
                        ...selectedFlow.settingsTemplate,
                    });
                } else {
                    onChange({
                        ...provider,
                        flowId: null,
                    });
                }
            }
        } else {
            // If user cancelled the dialog, reset the pending state
            setPendingProviderType(null);
            setPendingFlowId(null);
        }
        setConfirmationDialogOpen(false);
    };

    const versionValid = (minVersion) => {
        if (!minVersion) return true;
        const onecVersion = state.settings.onecVersion;
        if (!onecVersion) return true;

        const [minMajor, minMinor, minPatch, minBuild] = minVersion.split('.').map(Number);
        const [onecMajor, onecMinor, onecPatch, onecBuild] = onecVersion.split('.').map(Number);

        if (onecMajor > minMajor) return true;
        if (onecMajor < minMajor) return false;
        if (onecMinor > minMinor) return true;
        if (onecMinor < minMinor) return false;
        if (onecPatch > minPatch) return true;
        if (onecPatch < minPatch) return false;
        if (onecBuild >= minBuild) return true;

        return false;
    };


    return (
        <div>
            <Grid container spacing={2} alignItems="center" sx={{ mt: 0.5 }}>
                <Grid item xs={12} sm={8}>
                    <TextField
                        select
                        label="Выберите провайдера"
                        value={provider.providerType}
                        onChange={(event) => handleProviderSelect(event.target.value)}
                        fullWidth
                        name="providerType"
                        SelectProps={{
                            native: true,
                        }}
                    >
                        {ProvidersTemplate.map((templateGroup, index) => (
                            <option key={index} value={templateGroup.providerType}>
                                {templateGroup.providerType}
                            </option>
                        ))}
                    </TextField>
                </Grid>
                {selectedProvider && selectedProvider.flows && (
                    <Grid item xs={12} sm={4}>
                        <TextField
                            select
                            label="Выберите flow подключения"
                            value={selectedFlow}
                            onChange={(event) => handleFlowSelect(event.target.value)}
                            fullWidth
                            name="flow"
                            SelectProps={{
                                native: true,
                            }}
                        >
                            {selectedProvider.flows.map((flow) => (
                                versionValid(flow.minVersion) ? (
                                    <option key={flow.id} value={flow.id}>
                                        {flow.id}
                                    </option>
                                ) : (
                                    <option key={flow.id} value={flow.id} disabled>
                                        (Доступен с версии {flow.minVersion}) {flow.id}
                                    </option>
                                )
                            ))}
                        </TextField>
                    </Grid>
                )}
                <Grid item xs={12} sm={6}>
                    <TextField
                        error={Boolean(errors.name)}
                        helperText={errors.name}
                        label="Имя провайдера"
                        name="name"
                        value={provider.name}
                        onChange={handleInputChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        error={Boolean(errors.title)}
                        helperText={errors.title}
                        label="Title"
                        name="title"
                        value={provider.title}
                        onChange={handleInputChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        select
                        label="Authentication User Property Name"
                        value={provider.authenticationUserPropertyName}
                        onChange={handleInputChange}
                        fullWidth
                        name="authenticationUserPropertyName"
                        SelectProps={{
                            native: true,
                        }}
                    >
                        {[
                            {
                                value: 'name',
                                label: 'Имя пользователя',
                            },
                            {
                                value: 'OSUser',
                                label: 'Пользователь ОС',
                            },
                            {
                                value: 'email',
                                label: 'Email пользователя ИБ',
                            },
                            {
                                value: 'matchingKey',
                                label: 'Ключ сопоставления пользователя',
                            }
                        ].map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Authentication Claim Name"
                        name="authenticationClaimName"
                        value={provider.authenticationClaimName}
                        onChange={handleInputChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        error={Boolean(errors.discovery)}
                        helperText={errors.discovery}
                        label="Discovery"
                        name="discovery"
                        value={provider.discovery}
                        onChange={handleInputChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Box>
                        <InputImage
                            accept="image/*"
                            id={`contained-button-file-${provider.id}`}
                            type="file"
                            onChange={handleImageUpload}
                            providerId={provider.id}
                        />
                        <label htmlFor={`contained-button-file-${provider.id}`}>
                            <Button component="span" color="inherit" startIcon={<UploadIcon />}>
                                Загрузить изображение
                            </Button>
                        </label>
                    </Box>
                    {imagePreview && (
                        <ImagePreview
                            src={imagePreview}
                            alt="Предпросмотр изображения"
                        />
                    )}
                </Grid>
            </Grid>
            <ConfirmationDialog
                open={confirmationDialogOpen}
                title="Перезаполнение данных о провайдере"
                content="Вы сменили тип провайдера. Данные будут перезаполнены! Вы уверены?"
                onClose={handleDeleteConfirmationClose}
            />
        </div>
    );
}