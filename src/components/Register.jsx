import { Box, Button, TextField } from "@mui/material"
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Register({ handleCreateNewClick }) {

    const [newUsername, setNewUserName] = useState('');
    const [newPassword, setNewPassword] = useState('');

    return (
        <Box sx={{ backgroundColor: '#FFFFFF', height: '100%', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '70%', display: 'flex', alignItems: 'center', alignContent: 'center', justifyContent: 'space-evenly', flexDirection: 'column' }}>
                <h1 style={{ margin: 0 }}>LOGO</h1>
                <h4 style={{ fontSize: 'calc(1.275rem + .3vw)', fontWeight: 500, lineHeight: 1.2 }}>KitchenBlog</h4>
                <p>Create a new account</p>
                <TextField
                    id="outlined-basic"
                    label="New Username"
                    variant="outlined"
                    sx={{ width: '100%' }}
                    value={newUsername}
                    onChange={(e) => { setNewUserName(e.target.value) }} />
                <TextField
                    id="outlined-password-input"
                    label="New Password"
                    type="password"
                    sx={{ width: '100%' }}
                    value={newPassword}
                    onChange={(e) => { setNewPassword(e.target.value) }}
                />
                <Button
                    variant="contained"
                    sx={{ width: '100%', background: 'linear-gradient(to right, #f70776, #c3195d, #680747, #141010)' }}
                //onClick={handleCreateAccount}
                >
                    CREATE ACCOUNT
                </Button>
                <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', width: '80%' }}>
                    <p>Already have an account?</p>
                    <Button sx={{ fontSize: 12 }} variant="outlined" onClick={() => {
                        handleCreateNewClick();
                    }}>
                        <Link to="/login" style={{ color: 'inherit', textDecoration: 'none' }}>
                            Back to Login
                        </Link>
                    </Button>
                </div>
            </div>
        </Box>
    )
}