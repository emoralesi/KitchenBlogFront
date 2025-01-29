import React from 'react';
import { Box, Typography } from '@mui/material';

export const RecetaNotFound = () => {
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
                Receta no encontrada
            </Typography>
            <Typography variant="body1">
                La receta que estás buscando no existe en nuestra base de datos.
            </Typography>
        </Box>
    );
};
