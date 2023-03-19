import React from 'react';
import {
  TextField,
  FormControlLabel,
  Switch,
  Grid,
} from '@mui/material';
import styles from './EditPublicationForm.module.css';

function BasicParametersTab(props) {
  return (
    <div>
      <Grid container spacing={3} className={styles.grid}>
        <Grid item xs={8}>
          <TextField
            label="Наименование подключения"
            name="title"
            value={props.editedPublication.title}
            onChange={props.handleInputChange}
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid item xs={4}>
          <FormControlLabel
            control={
              <Switch
                checked={props.editedPublication.active}
                onChange={props.handleSwitchChange}
                name="active"
                color="primary"
              />
            }
            label="Активно ли подключение"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="location"
            name="name"
            value={props.editedPublication.name}
            onChange={props.handleInputChange}
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Имя пользователя"
            name="usr"
            value={props.editedPublication.usr}
            onChange={props.handleInputChange}
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Пароль"
            name="pwd"
            type="password"
            value={props.editedPublication.pwd}
            onChange={props.handleInputChange}
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={props.editedPublication.enable}
                onChange={props.handleSwitchChange}
                name="enable"
                color="primary"
              />
            }
            label="Разрешен ли вход пользователей"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={props.editedPublication.enableStandardOData}
                onChange={props.handleSwitchChange}
                name="enableStandardOData"
                color="primary"
              />
            }
            label="Разрешить OData"
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default BasicParametersTab;