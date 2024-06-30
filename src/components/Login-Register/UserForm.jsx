import { Box, Button, Grid, TextField } from "@mui/material";
import { useState } from "react";
import LogIn from "./LogIn";
import Register from "./Register";

export default function UserForm({ formType }) {
    const [isLoginForm, setIsLoginForm] = useState(formType);

    const handleCreateNewClick = () => {
        setIsLoginForm(!isLoginForm);
    };

    const handleLogin = () => {
        // Lógica de inicio de sesión aquí
    };

    const handleCreateAccount = () => {
        // Lógica para crear una cuenta aquí
    };

    return (
        <Box sx={{ width: '100%', height: '100vh', backgroundColor: '#eee', overflow: 'auto' }}>
            <Grid container spacing={0} sx={{ height: '100%', padding: '20px' }}>
                <Grid item xs={12} sm={12} md={6} sx={{
                    minHeight: { xs: '100%', md: '100%' },
                    transition: 'transform 0.5s',
                    transform: {
                        //xs: showFirstGrid ? 'translateY(0)' : 'translateY(100%)',
                        md: isLoginForm ? 'translateX(0)' : 'translateX(100%)'
                    }
                }}>
                    {isLoginForm ?
                        <LogIn
                            handleCreateNewClick={handleCreateNewClick} />
                        : <Register
                            handleCreateNewClick={handleCreateNewClick} />}
                </Grid>
                <Grid item xs={12} sm={12} md={6} sx={{
                    minHeight: { xs: '80%', md: '100%' },
                    transition: 'transform 0.5s',
                    transform: {
                        //xs: showFirstGrid ? 'translateY(0)' : 'translateY(-100%)',
                        md: isLoginForm ? 'translateX(0)' : 'translateX(-100%)'
                    }
                }}>
                    <Box sx={{ background: 'linear-gradient(to right, #f70776, #c3195d, #680747, #141010)', height: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                            <h4 style={{ fontFamily: '"Roboto", sans-serif', color: '#FFFFFF', fontSize: 'calc(1.275rem + .3vw)' }}>Welcome to the Kitchen Blog</h4>
                            <p style={{ color: '#FFFFFF', textAlign: 'center', fontSize: '.875em', fontFamily: '"Roboto", sans-serif' }}>Here you will be able to share your skills in the kitchen and create multiple recetas about recipes and advice!</p>
                        </div>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}
