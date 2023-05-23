import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";

const ConfirmationDialog = ({ open, title, content, onClose }) => {
    const handleCancel = () => {
        onClose(false);
    };

    const handleConfirm = () => {
        onClose(true);
    };

    return (
        <Dialog open={open} onClose={handleCancel}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{content}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel} color="primary">
                    Отмена
                </Button>
                <Button onClick={handleConfirm} color="primary" autoFocus>
                    Подтвердить
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationDialog;