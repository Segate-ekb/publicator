// Publications.js
import React, { useContext, useState } from 'react';
import {
    Card,
    CardActions,
    CardContent,
    Typography,
    Switch,
    IconButton,
    Link,
    Grid,
    Breadcrumbs,
    Fab
} from '@mui/material';
import { useBasesData } from './DataContext';
import SelectedIndexContext from './SelectedIndexContext';
import styles from './css/Publications.module.css';
import EditIcon from '@mui/icons-material/Edit';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import AddPublicationForm from './AddPublicationForm';
import EditPublicationForm from './EditPublicationForm'
import AddIcon from '@mui/icons-material/Add';


function Publications() {
    const { basesData, setBasesData } = useBasesData();
    const selectedIndex = useContext(SelectedIndexContext);
    const selectedBase = basesData[selectedIndex];

    if (!selectedBase) {
        return <div>Загружается...</div>;
    }
    const publications = selectedBase.publications;

    const handleBreadcrumbClick = () => {
        // handle click on breadcrumb
    }

    if (!basesData || !basesData[selectedIndex]) {
        return <div>Не выбрана активная база!</div>;
    }





    const handleToggle = (index) => () => {
        const updatedPublications = publications.map((publication, i) => {
            if (i === index) {
                return { ...publication, active: !publication.active };
            }
            return publication;
        });

        const newChecked = updatedPublications
            .filter((publication) => publication.active)
            .reduce((acc, curr) => acc || curr.active, false);

        setBasesData((prevBasesData) => {
            const updatedBasesData = prevBasesData.map((base, i) =>
                i === selectedIndex
                    ? { ...base, publications: updatedPublications }
                    : base
            );
            return updatedBasesData;
        });
    };

    const [openAddForm, setOpenAddForm] = useState(false);
    const [openEditForm, setOpenEditForm] = useState(false);
    const [selectedPublicationIndex, setSelectedPublicationIndex] = useState(null);

    const handleOpenAddForm = () => {
        setOpenAddForm(true);
    };

    const handleCloseAddForm = () => {
        setOpenAddForm(false);
    };

    const handleAddPublication = ({ name, title }, closeForm )=> {

        if (!isUnique(name, title)) {
            alert("Name и Title должны быть уникальными в пределах базы данных.");
            return false;
        }
        const newPublication = {
            name,
            title,
            actived: true,
            enable: true,
            ws: {
                publishExtensionsByDefault: true,
                wsList: [],
            },
            httpServices: {
                publishExtensionsByDefault: true,
                publishByDefault: true,
                hsList: [],
            },
        };

        setBasesData((prevBasesData) => {
            const newPublications = [...prevBasesData[selectedIndex].publications, newPublication];
            const newBasesData = prevBasesData.map((base, index) =>
                index === selectedIndex ? { ...base, publications: newPublications } : base
            );
            return newBasesData;
        });

        closeForm(); 
        return true;
    };

    const handleUpdatePublication = (index, updatedPublication, closeForm) => {

        if (!isUnique(updatedPublication.name, updatedPublication.title, index)) {
            alert("Name и Title должны быть уникальными в пределах базы данных.");
            return false;
        }
        setBasesData((prevBasesData) => {
            const newPublications = prevBasesData[selectedIndex].publications.map((publication, i) =>
                i === index ? updatedPublication : publication
            );

            const newBasesData = prevBasesData.map((base, i) =>
                i === selectedIndex ? { ...base, publications: newPublications } : base
            );

            return newBasesData;
        });
        closeForm();
        return true;
    };


    const handleOpenEditForm = (index) => {
        setSelectedPublicationIndex(index);
        setOpenEditForm(true);
    };

    const handleCloseEditForm = () => {
        setOpenEditForm(false);
    };

    const handleDeletePublication = (publication_income) => {
        // Удалите публикацию с заданным id из массива publications
        console.log(publication_income);
        publications.forEach((publication) => {
            console.log (publication.name == publication_income.name);
            console.log (publication); 
        })
        const updatedPublications = publications.filter((publication) => publication.name != publication_income.name);
        console.log(updatedPublications);

        // Обновите состояние basesData с помощью setBasesData
        setBasesData((prevBasesData) => {
            const updatedBasesData = prevBasesData.map((base, i) =>
                i === selectedIndex
                    ? { ...base, publications: updatedPublications }
                    : base
            );
            return updatedBasesData;
        });
    };

    const isUnique = (name, title, ignoreIndex) => {
        return !publications.some((pub, index) => {
            if (index === ignoreIndex) {
                return false;
            }
            return pub.name === name || pub.title === title;
        });
    };

    return (
        <div className={styles.publicationsWrapper}>
            <div className={styles.publicationsContainer}>
                <Breadcrumbs
                    separator={<NavigateNextIcon fontSize="small" />}
                    aria-label="breadcrumb"
                    style={{ marginLeft: '16px' }}
                >
                    <Typography color="textPrimary">{selectedBase.name}</Typography>

                    <Typography color="textPrimary">Публикации</Typography>
                </Breadcrumbs>
                <Typography color="textSecondary">
                    Srvr: {selectedBase.Srvr} | Ref: {selectedBase.Ref}
                </Typography>
                <Grid container spacing={3}>
                    {publications.map((publication, index) => (
                        <Grid item xs={12} sm={4} md={3} key={index}>
                            <Card key={index} className={`${styles.publicationCard} ${styles.fixedSizeCard}`}>
                                <CardContent>
                                    <Typography variant="h5">{publication.title}</Typography>
                                    <Typography
                                        color="text.secondary"
                                        display="block"
                                        variant="caption"
                                    >{publication.name}</Typography>
                                </CardContent>
                                <CardActions style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Switch
                                        checked={publication.active}
                                        onChange={handleToggle(index)}
                                        inputProps={{ 'aria-label': 'Toggle publication' }}
                                    />
                                    <IconButton onClick={() => handleOpenEditForm(index)} color="primary" style={{ marginLeft: '8px' }}>
                                        <EditIcon />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                <Fab
                    color="primary"
                    onClick={handleOpenAddForm}
                    className={styles.addPublicationButton}
                >
                    <AddIcon />
                </Fab>
                <AddPublicationForm
    open={openAddForm}
    handleClose={handleCloseAddForm}
    handleAddPublication={({ name, title }) => handleAddPublication({ name, title }, handleCloseAddForm)}
/>

<EditPublicationForm
    open={openEditForm}
    handleClose={handleCloseEditForm}
    publicationIndex={selectedPublicationIndex}
    publication={publications[selectedPublicationIndex]}
    handleDeletePublication={handleDeletePublication}
    handleUpdatePublication={(updatedPublication) =>
        handleUpdatePublication(selectedPublicationIndex, updatedPublication, handleCloseEditForm)
    }
/>
            </div>
        </div>
    );
}

export default Publications;