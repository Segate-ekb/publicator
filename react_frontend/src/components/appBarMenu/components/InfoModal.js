import * as React from 'react';
import { Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, Box, Link } from '@mui/material';
import TelegramIcon from '@mui/icons-material/Telegram';
import GitHubIcon from '@mui/icons-material/GitHub';


function ProjectInfoForm({ open, onClose }) {
    const projectName = 'Публикатор 1С';
    const projectVersion = '1.1.0';
    const projectDescription = 'Проект преднозначен для удобной работы с публикациями на Веб-сервере.  Код полностью открыт и доступен! \n Присоединяйтесь в катанл в телеграм, чтобы не пропутсить критичные обновления.';
    const telegramUrl = 'https://t.me/DevOps_onec';
    const githubUrl = 'https://github.com/Segate-ekb/publicator';

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Информация о проекте</DialogTitle>
            <DialogContent>
                <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
                    <img src="/logo.png" alt="Logo" style={{ maxHeight: '80px', marginRight: '8px' }} />
                    <Typography variant="h5">{projectName}</Typography>
                </Box>
                <Typography variant="subtitle1">Версия: {projectVersion}</Typography>
                <Typography variant="body1" mt={2}>{projectDescription}</Typography>
                <Box mt={2}>
                    <Typography variant="subtitle2">Ссылки:</Typography>
                    <Box display="flex" alignItems="center">
                        <Link href={telegramUrl} target="_blank" rel="noopener noreferrer" sx={{ marginRight: 2 }}>
                            <TelegramIcon color="primary" fontSize="large" />
                        </Link>
                        <Link href={githubUrl} target="_blank" rel="noopener noreferrer">
                            <GitHubIcon color="action" fontSize="large" />
                        </Link>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Ок</Button>
            </DialogActions>
        </Dialog>
    );
}

export default ProjectInfoForm;