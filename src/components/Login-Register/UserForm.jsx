import {
  Box,
  Button,
  Grid,
  TextField,
  Link,
  Typography,
  IconButton,
  Tooltip,
  Snackbar,
} from "@mui/material";
import { useState } from "react";
import LogIn from "./LogIn";
import Register from "./Register";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import LanguageIcon from "@mui/icons-material/Language";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

export default function UserForm({ formType }) {
  const [isLoginForm, setIsLoginForm] = useState(formType);
  const [copied, setCopied] = useState(false);

  const handleCreateNewClick = () => {
    setIsLoginForm(!isLoginForm);
  };


  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch (err) {
      console.error("Error al copiar:", err);
    }
  };
  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        backgroundColor: "#eee",
        overflow: "auto",
      }}
    >
      <Grid container spacing={0} sx={{ height: "100%", padding: "20px" }}>
        <Grid
          item
          xs={12}
          sm={12}
          md={6}
          sx={{
            minHeight: { xs: "100%", md: "100%" },
            transition: "transform 0.5s",
            transform: {
              //xs: showFirstGrid ? 'translateY(0)' : 'translateY(100%)',
              md: isLoginForm ? "translateX(0)" : "translateX(100%)",
            },
          }}
        >
          {isLoginForm ? (
            <LogIn handleCreateNewClick={handleCreateNewClick} />
          ) : (
            <Register handleCreateNewClick={handleCreateNewClick} />
          )}
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={6}
          sx={{
            transition: "transform 0.5s",
            transform: {
              //xs: showFirstGrid ? 'translateY(0)' : 'translateY(-100%)',
              md: isLoginForm ? "translateX(0)" : "translateX(-100%)",
            },
          }}
        >
          <Box
            sx={{
              background:
                "linear-gradient(to right, #7ec4e3, #56a5d8, #368ac9, #1f6fae)",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              px: 2,
            }}
          >
            <Box sx={{ textAlign: "center", color: "#FFFFFF", maxWidth: 700 }}>
              <Typography
                variant="h2"
                sx={{
                  fontFamily: '"Roboto Slab", serif',
                  fontWeight: "bold",
                  mb: 1,
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                  letterSpacing: 1,
                }}
              >
                Kitchen Blog
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: '"Roboto", sans-serif',
                  mb: 2,
                  fontSize: { xs: "1.2rem", md: "1.5rem" },
                }}
              >
                Bienvenido a mi página web
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: '"Roboto", sans-serif',
                  mb: 3,
                  fontSize: { xs: "1rem", md: "1.1rem" },
                }}
              >
                Diseñado y desarrollado por:{" "}
                <strong>Emmanuel Morales Inzunza</strong>
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                <IconButton
                  component={Link}
                  href="https://www.linkedin.com/in/emmanuel-morales-inzunza-0b5a4a333/"
                  target="_blank"
                  rel="noopener"
                  aria-label="LinkedIn"
                  sx={{ color: "#FFFFFF" }}
                >
                  <LinkedInIcon fontSize="large" />
                </IconButton>
                <IconButton
                  component={Link}
                  href="https://cv-web-git-master-emoralesis-projects.vercel.app/"
                  target="_blank"
                  rel="noopener"
                  aria-label="Personal Website"
                  sx={{ color: "#FFFFFF" }}
                >
                  <LanguageIcon fontSize="large" />
                </IconButton>
                <IconButton
                  component={Link}
                  href="https://github.com/emoralesi"
                  target="_blank"
                  rel="noopener"
                  aria-label="GitHub"
                  sx={{ color: "#FFFFFF" }}
                >
                  <GitHubIcon fontSize="large" />
                </IconButton>
              </Box>

              <Box
                sx={{
                  mt: 4,
                  p: 2,
                  borderRadius: 2,
                  border: "2px dashed rgba(255, 255, 255, 0.7)",
                  color: "#FFFFFF",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ fontSize: { xs: "0.95rem", md: "1rem" } }}
                >
                  ¿No quieres crear una cuenta? Utiliza la siguiente para probar
                  el sitio web:
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <Typography variant="body2">
                    <strong>Email:</strong> usuarioprueba@test.com
                  </Typography>
                  <Tooltip title="Copiar email">
                    <IconButton
                      onClick={() => handleCopy("usuarioprueba@test.com")}
                      size="small"
                      sx={{ color: "#fff", ml: 1 }}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="body2">
                    <strong>Contraseña:</strong> usuarioprueba
                  </Typography>
                  <Tooltip title="Copiar contraseña">
                    <IconButton
                      onClick={() => handleCopy("usuarioprueba")}
                      size="small"
                      sx={{ color: "#fff", ml: 1 }}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <Snackbar
                open={copied}
                autoHideDuration={2000}
                onClose={() => setCopied(false)}
                message="Copiado al portapapeles"
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
