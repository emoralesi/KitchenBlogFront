import React from 'react';
import { Navigate } from 'react-router-dom';

function SessionGuard({ element }) {
    // Lógica para verificar si el usuario ha iniciado sesión.
    const isUserLoggedIn = localStorage.getItem('UserLogged');

    if (isUserLoggedIn) {
        return element;
    } else {
        return <Navigate to="/login" />;
    }
}

export default SessionGuard;