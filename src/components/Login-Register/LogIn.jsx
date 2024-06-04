import { Box, Button, TextField } from "@mui/material"
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginUsuario } from "../../services/UserService";
import { enqueueSnackbar } from "notistack";

export default function LogIn({ handleCreateNewClick }) {

    const [userEmail, setUserEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await LoginUsuario({ userEmail, password });

        console.log("mi result", result);
        if (result.status == 'ok') {
            localStorage.setItem('UserLogged', JSON.stringify(result));
            enqueueSnackbar('Inicio de sesion correcto', { variant: 'success' });
            navigate('/main/bienvenido')
        } else if (result.status == 'notOK') {
            enqueueSnackbar('Nombre de usuario y/o contraseña incorrecta', { variant: 'warning' });
        } else {
            enqueueSnackbar('A ocurrido un error, favor intente mas tarde', { variant: 'error' });
        }

    }

    return (
        <Box sx={{ backgroundColor: '#FFFFFF', height: '100%', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '70%', display: 'flex', alignItems: 'center', alignContent: 'center', justifyContent: 'space-evenly', flexDirection: 'column' }}>
                <h1 style={{ margin: 0 }}>LOGO</h1>
                <h4 style={{ fontSize: 'calc(1.275rem + .3vw)', fontWeight: 500, lineHeight: 1.2 }}>KitchenBlog</h4>
                <p>Please login to your account</p>
                <TextField
                    id="outlined-basic"
                    label="Username"
                    variant="outlined"
                    sx={{ width: '100%' }}
                    value={userEmail}
                    onChange={(e) => { setUserEmail(e.target.value) }} />
                <TextField
                    id="outlined-password-input"
                    label="Password"
                    type="password"
                    sx={{ width: '100%' }}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value) }}
                />
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    sx={{ width: '100%', background: 'linear-gradient(to right, #f70776, #c3195d, #680747, #141010)' }}
                //onClick={handleLogin}
                >
                    LOG IN
                </Button>
                <a href="#">Forgot Password?</a>
                <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', width: '80%' }}>
                    <p>Don't have an account?</p>
                    <Button sx={{ fontSize: 12 }} variant="outlined" onClick={() => {
                        handleCreateNewClick();
                    }}>
                        <Link to="/register" style={{ color: 'inherit', textDecoration: 'none' }}>
                            Create New
                        </Link>

                    </Button>
                </div>
            </div>
        </Box>
    )
}