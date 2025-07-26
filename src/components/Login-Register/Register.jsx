import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { RegisterUsuario } from "../../services/UserService";
import logo from "../../assets/kitchen_blog_logo_centered.svg";

export default function Register({ handleCreateNewClick }) {
  const navigate = useNavigate();

  const [newEmail, setNewEmail] = useState("");
  const [newUsername, setNewUserName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newConfirmPassword, setNewConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleCreateAccount = async () => {
    setFieldErrors({});

    if (newPassword !== newConfirmPassword) {
      enqueueSnackbar("Las contraseñas no coinciden", {
        variant: "warning",
        autoHideDuration: 2000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "left",
        },
      });
      return;
    }

    setLoading(true);

    try {
      const response = await RegisterUsuario({
        email: newEmail.trim(),
        username: newUsername.trim(),
        password: newPassword,
      });

      console.log("mi response", response);

      if (response.status === "ok") {
        enqueueSnackbar(response.message || "Usuario registrado con éxito", {
          variant: "success",
          autoHideDuration: 2000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "left",
          },
        });

        handleCreateNewClick();
        navigate("/login");

        setNewEmail("");
        setNewUserName("");
        setNewPassword("");
        setNewConfirmPassword("");
      } else if (response.status === "warning") {
        if (response.errors) {
          const errors = {};
          response.errors.forEach((err) => {
            console.log("mi err", err);

            errors[err.path] = err.msg;
            console.log(errors);
          });
          setFieldErrors(errors);
        } else {
          enqueueSnackbar(response.message || "Error de validación", {
            variant: "warning",
            autoHideDuration: 2000,
            anchorOrigin: {
              vertical: "top",
              horizontal: "left",
            },
          });
        }
      } else {
        enqueueSnackbar("Error inesperado en el registro", {
          variant: "error",
          autoHideDuration: 2000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "left",
          },
        });
      }
    } catch (error) {
      enqueueSnackbar("Error al conectar con el servidor", {
        variant: "error",
        autoHideDuration: 2000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "left",
        },
      });
      console.error("Error en el registro:", error);
    } finally {
      setLoading(false);
    }
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
          justifyContent: "space-evenly",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="h3"
          fontWeight="bold"
          sx={{ height: "300px", width: "700px" }}
          gutterBottom
        >
          <img
            src={logo}
            alt="Kitchen Blog Logo"
            style={{ height: "300px", width: "700px" }}
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
          Crear una cuenta
        </Typography>

        <TextField
          label="Correo Electrónico"
          variant="outlined"
          fullWidth
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          error={!!fieldErrors.email}
          helperText={fieldErrors.email}
          sx={{ mb: 1 }}
        />

        <TextField
          label="Nombre de usuario"
          variant="outlined"
          fullWidth
          value={newUsername}
          onChange={(e) => setNewUserName(e.target.value)}
          error={!!fieldErrors.username}
          helperText={fieldErrors.username}
          sx={{ mb: 1 }}
        />

        <TextField
          label="Nueva contraseña"
          type="password"
          fullWidth
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          error={!!fieldErrors.password}
          helperText={fieldErrors.password}
          sx={{ mb: 1 }}
        />

        <TextField
          label="Confirmar contraseña"
          type="password"
          fullWidth
          value={newConfirmPassword}
          onChange={(e) => setNewConfirmPassword(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Button
          variant="contained"
          onClick={handleCreateAccount}
          fullWidth
          disabled={loading}
          sx={{
            background:
              "linear-gradient(to right, #7ec4e3, #56a5d8, #368ac9, #1f6fae)",
            mt: 1,
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "CREAR CUENTA"
          )}
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
