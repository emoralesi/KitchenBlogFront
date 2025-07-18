import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Register({ handleCreateNewClick }) {
  const [newUsername, setNewUserName] = useState("");
  const [newPassword, setNewPassword] = useState("");

  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box
        style={{
          width: "70%",
          display: "flex",
          alignItems: "center",
          alignContent: "center",
          justifyContent: "space-evenly",
          flexDirection: "column",
        }}
      >
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          LOGO
        </Typography>

        <Typography
          variant="h5"
          fontWeight={500}
          textAlign="center"
          gutterBottom
          sx={{ color: "#333" }}
        >
          KitchenBlog
        </Typography>

        <Typography variant="body1" sx={{ color: "#555", mb: 1 }}>
          Crear una cuenta
        </Typography>

        <TextField
          id="outlined-basic"
          label="Nuevo usuario"
          variant="outlined"
          fullWidth
          value={newUsername}
          onChange={(e) => setNewUserName(e.target.value)}
        />

        <TextField
          id="outlined-password-input"
          label="Nueva contraseña"
          type="password"
          fullWidth
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <Button
          variant="contained"
          fullWidth
          sx={{
            background: "linear-gradient(to right, #7ec4e3, #56a5d8, #368ac9, #1f6fae)",
            mt: 1,
          }}
        >
          CREAR CUENTA
        </Button>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "80%",
            mt: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: "#555" }}>
            ¿Ya tienes una cuenta?
          </Typography>

          <Button
            variant="outlined"
            size="small"
            onClick={handleCreateNewClick}
          >
            <Link
              to="/login"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              Regresa al Login
            </Link>
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
