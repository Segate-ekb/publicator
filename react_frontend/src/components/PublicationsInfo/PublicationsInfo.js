import React, { useContext, useState } from "react";
import { Box, Card, CardContent, Typography, CardActions, IconButton, Switch, Fab, Grid, useMediaQuery, useTheme, Link } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import LinkIcon from "@mui/icons-material/Link";
import AppContext from "../../context/AppContext";
import PublicationPropertiesEdit from "./PublicationPropertiesEdit/PublicationPropertiesEdit";

export default function PublicationsInfo() {
    const { state, updatePublication } = useContext(AppContext);
    const selectedBase = state.bases.find((base) => base.id === state.selectedBaseId);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editingPublication, setEditingPublication] = useState(null);
    const theme = useTheme();
    const isMdDown = useMediaQuery(theme.breakpoints.down("md"));

    const createPublicationUrl = (baseUrl, publicationName) => {
        const cleanedBaseUrl = baseUrl.replace(/\/+$/, ""); // убираем слэши в конце строки
        const cleanedPublicationName = publicationName.replace(/^\/+/, ""); // убираем слэши в начале строки
        return `${cleanedBaseUrl}/${cleanedPublicationName}`;
    };

    const handlePublicationToggle = (publication) => {
        const updatedPublication = {
            ...publication,
            active: !publication.active,
        };
        updatePublication(publication.id, updatedPublication);
    };

    const handleEditDialogOpen = (publication) => {
        setEditingPublication(publication);
        setEditDialogOpen(true);
    };

    const handleEditDialogClose = (publication) => {
        setEditDialogOpen(false);
        setEditingPublication(null);
    };

    if (!selectedBase) {
        return <Typography variant="h6">Выберите базу данных</Typography>;
    }

    return (
        <Box>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Fab
                        variant={isMdDown ? "circular" : "extended"}
                        color="primary"
                        onClick={() => handleEditDialogOpen(null)}
                        sx={{
                            position: "fixed",
                            top: 72,
                            right: 24,
                        }}
                    >
                        <AddIcon />
                        {!isMdDown && "Новая публикация"}
                    </Fab>
                </Grid>
                {selectedBase.publications.map((publication) => (
                    <Grid item key={publication.id} xs={12} sm={6} md={6} lg={4} sx={{ marginTop: theme.spacing(5) }}>
                        <Card key={publication.id} sx={{ maxWidth: 400, mb: 2 }}>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    {publication.title}
                                </Typography>
                                <Typography variant="subtitle1" color="text.secondary">
                                    <LinkIcon sx={{ verticalAlign: "bottom", mr: 0.5 }} />
                                    {state.settings && state.settings.publicationServerUrl && publication.active ? (
                                        <Link
                                            href={createPublicationUrl(state.settings.publicationServerUrl, publication.name)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Ссылка на публикацию
                                        </Link>
                                    ) : (
                                        <span style={{ color: "rgba(0, 0, 0, 0.38)" }}>Ссылка на публикацию</span>
                                    )}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                                    <Switch
                                        checked={publication.active}
                                        onChange={() => handlePublicationToggle(publication)}
                                        inputProps={{ "aria-label": "controlled" }}
                                    />
                                    <IconButton
                                        edge="end"
                                        color="inherit"
                                        aria-label="edit"
                                        onClick={() => handleEditDialogOpen(publication)}
                                        sx={{ mr: 0.1 }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </Box>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <PublicationPropertiesEdit
                open={editDialogOpen}
                publication={editingPublication}
                onClose={handleEditDialogClose}
            />
        </Box>
    );
}