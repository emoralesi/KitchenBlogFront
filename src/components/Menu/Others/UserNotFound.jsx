import React from 'react';
import { Box, Typography } from '@mui/material';

export const UserNotFound = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '80vh',
                textAlign: 'center',
            }}
        >
            <Typography variant="h4" gutterBottom>
                Usuario no encontrado
            </Typography>
            <Typography variant="body1">
                El usuario que estás buscando no existe en nuestra base de datos.
            </Typography>
        </Box>
    );
};
