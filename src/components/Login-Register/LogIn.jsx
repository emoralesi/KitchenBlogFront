import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginUsuario } from "../../services/UserService";
import { enqueueSnackbar } from "notistack";
import logo from "../../assets/kitchen_blog_logo_centered.svg";

export default function LogIn({ handleCreateNewClick }) {
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await LoginUsuario({ userEmail, password });

    if (result.status == "ok") {
      localStorage.setItem("UserLogged", JSON.stringify(result));
      enqueueSnackbar("Inicio de sesion correcto", {
        variant: "success",
        autoHideDuration: 2000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "left",
        },
      });
      navigate("/main/bienvenido");
    } else if (result.status == "notOK") {
      enqueueSnackbar("Nombre de usuario y/o contraseña incorrecta", {
        variant: "warning",
        autoHideDuration: 2000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "left",
        },
      });
    } else {
      enqueueSnackbar("A ocurrido un error, favor intente mas tarde", {
        variant: "error",
        autoHideDuration: 2000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "left",
        },
      });
    }

    setLoading(false);
  };

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
        <Typography
          variant="h3"
          fontWeight="bold"
          sx={{ height: "220px", width: "700px" }}
          gutterBottom
        >
          <img
            src={logo}
            alt="Kitchen Blog Logo"
            style={{ height: "250px", width: "700px" }}
          />
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
          Por favor inicia sesión con tu cuenta
        </Typography>

        <TextField
          id="outlined-basic"
          label="Username"
          variant="outlined"
          fullWidth
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          sx={{ marginBottom: "10px" }}
        />

        <TextField
          id="outlined-password-input"
          label="Password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          sx={{
            background:
              "linear-gradient(to right, #7ec4e3, #56a5d8, #368ac9, #1f6fae)",
            mt: 1,
          }}
        >
          INICIAR SESIÓN
        </Button>

        <Typography variant="body2" sx={{ mt: 1, color: "#1976d2" }}>
          <a href="#" style={{ textDecoration: "none", color: "inherit" }}>
            ¿Olvidaste tu contraseña?
          </a>
        </Typography>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1000,
            }}
          >
            <CircularProgress />
          </Box>
        ) : null}

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
            ¿No tienes una cuenta?
          </Typography>

          <Button
            variant="outlined"
            size="small"
            onClick={handleCreateNewClick}
          >
            <Link
              to="/register"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              CREAR NUEVA CUENTA
            </Link>
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
