import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import {
  Avatar,
  IconButton,
  Modal,
  CircularProgress,
  Typography,
  Button,
} from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUsuario } from "../../../Hooks/useUsuario";
import { Unauthorized } from "../../../utils/401Unauthorized";
import { getStorageUser } from "../../../utils/StorageUser";
import { Favourites } from "./MyFavourites";
import { PerfilOther } from "./PerfilOther";
import { PerfilOwner } from "./PerfilOwner";
import { FavouritesOther } from "./MyFavouritesOther";
import { UserNotFound } from "../Others/UserNotFound";
import { enqueueSnackbar } from "notistack";
import { getCloudinaryUrl } from "../../../utils/GetCloudinaryUrl";

export const Perfiles = () => {
  let { username } = useParams();

  const { ObtenerDataFavAndRec, getIdUserByUserName } = useUsuario();

  const [value, setValue] = useState(0);
  const [cantidadReceta, setCantidadReceta] = useState(null);
  const [cantidadFavoritos, setCantidadFavoritos] = useState(null);
  const [IdUser, setIdUser] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [loadingModalSubmit, setLoadingModalSubmit] = useState(false);
  const [openEditProfilePic, setOpenEditProfilePic] = useState(false);
  const [image, setImage] = useState(null);

  const [userExists, setUserExists] = useState(true);
  const [loading, setLoading] = useState(true);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClose = () => {
    setOpenEditProfilePic(false);
    setImage(null);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      enqueueSnackbar("Debe seleccionar una imagen primero", {
        variant: "warning",
      });
      return;
    }

    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    if (!validImageTypes.includes(file.type)) {
      event.target.value = null;
      enqueueSnackbar(
        "Solo se admiten un archivo de imagen (jpg, png, webp, etc...).",
        { variant: "warning" }
      );
      return;
    }

    const maxSizeInMB = 10;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    if (file.size > maxSizeInBytes) {
      enqueueSnackbar("La imagen no debe superar los 10 MB.", {
        variant: "warning",
      });
      event.target.value = null;
      return;
    }

    setImage(file);
    enqueueSnackbar("Imagen actualizada", { variant: "success" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!image) {
      enqueueSnackbar("Debe seleccionar una imagen primero", {
        variant: "warning",
      });
      return;
    }

    const extension = image.name.split(".").pop();

    const renamedImage = new File([image], `${IdUser}.${extension}`, {
      type: image.type,
    });

    const formData = new FormData();
    formData.append("profileImage", renamedImage);
    formData.append("idUsuario", IdUser);
    formData.append("folderName", "Profiles_images");

    setLoadingModalSubmit(true);

    try {
      const requestOptions = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getStorageUser().token}`,
        },
        body: formData,
      };
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/upload-profile-image`,
        requestOptions
      )
        .then((res) => {
          Unauthorized(res.status);
          return res;
        })
        .then((res) => {
          return res.json();
        });

      const userData = JSON.parse(localStorage.getItem("UserLogged"));
      if (userData) {
        userData.profileImageUrl = response.imageUrl;
        localStorage.setItem("UserLogged", JSON.stringify(userData));
      } else {
        console.error("No se encontró el objeto UserLogged en el localStorage");
      }
      setOpenEditProfilePic(false);
      setImage(null);
    } catch (error) {
      console.error("Error al subir la imagen:", error);
    } finally {
      setLoadingModalSubmit(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        var idUser = null;

        if (
          username.toLowerCase() === getStorageUser().username.toLowerCase()
        ) {
          idUser = getStorageUser().usuarioId;
          setUserImage(getStorageUser().profileImageUrl);
          setUserExists(true);
        } else {
          const Usuario = await getIdUserByUserName({ username: username });
          if (!Usuario || !Usuario.userId) {
            setUserExists(false);
            return;
          }
          idUser = Usuario.userId;
          setUserImage(Usuario.user.profileImageUrl);
        }

        setIdUser(idUser);

        const result = await ObtenerDataFavAndRec({ idUser: idUser });

        setCantidadReceta(result.recetaCount);
        setCantidadFavoritos(result.favouriteCount);
      } catch (error) {
        console.error("Error fetching data", error);
        setUserExists(false);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [username, getIdUserByUserName, ObtenerDataFavAndRec]);

  if (!userExists) {
    return <UserNotFound />;
  }

  return (
    <div style={{ marginTop: "10px" }}>
      <div style={{ display: "flex", height: "90px", alignItems: "center" }}>
        <div
          style={{
            width: "50%",
            display: "flex",
            justifyContent: "center",
            margin: "10px 10px 10px 10px",
          }}
        >
          <div
            style={{ position: "relative" }}
            onMouseEnter={() => {
              if (IdUser === getStorageUser().usuarioId) {
                const editButton = document.querySelector(".edit-icon-button");
                if (editButton) editButton.style.display = "block";
              }
            }}
            onMouseLeave={() => {
              const editButton = document.querySelector(".edit-icon-button");
              if (editButton) editButton.style.display = "none";
            }}
          >
            {console.log("mi userImage", userImage)}
            {console.log(
              "convertido",
              getCloudinaryUrl(userImage, { width: 400 })
            )}
            <Avatar
              sx={{
                width: 100,
                height: 100,
                fontSize: 80,
              }}
              src={
                userImage ? getCloudinaryUrl(userImage, { width: 400 }) : null
              }
            >
              {username?.substring(0, 1).toUpperCase()}
            </Avatar>
            <IconButton
              className="edit-icon-button"
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                display: "none",
                "&:hover": {
                  display: "block",
                },
              }}
              onClick={() => {
                setOpenEditProfilePic(true);
              }}
            >
              <EditIcon />
            </IconButton>
          </div>
        </div>
        <Box
          sx={{
            width: "100%",
            maxWidth: 500,
            fontFamily: "Roboto, sans-serif",
            color: "#333",
            wordBreak: "break-word", // Evita desbordes
          }}
        >
          <Box sx={{ width: "100%", mb: 1 }}>
            <Typography
              sx={{
                fontWeight: 600,
                fontFamily: "Playfair Display, serif",
                fontSize: {
                  xs: "1.5rem", // móviles
                  sm: "2rem",
                  md: "2.25rem",
                },
                lineHeight: 1.2,
                overflowWrap: "break-word",
                textAlign: "left",
              }}
            >
              {username}
            </Typography>
          </Box>

          <Typography
            variant="body1"
            sx={{
              fontSize: "1rem",
              fontFamily: "Roboto, sans-serif",
              mb: 0.5,
            }}
          >
            Recetas: <strong>{cantidadReceta ?? 0}</strong>
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: "1rem",
              fontFamily: "Roboto, sans-serif",
            }}
          >
            Favoritos: <strong>{cantidadFavoritos ?? 0}</strong>
          </Typography>
        </Box>
      </div>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            sx={{
              backgroundColor: "background.paper",
              "& .MuiTabs-flexContainer": {
                display: "flex",
                justifyContent: "space-evenly",
              },
              minHeight: "unset",
              height: "38px",
            }}
          >
            <Tab label="Post" {...a11yProps(0)} />
            <Tab label="Favourites" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          {cantidadReceta !== null && cantidadReceta !== undefined ? (
            getStorageUser().username.toLowerCase() ===
            username.toLowerCase() ? (
              <PerfilOwner
                setCantidadFavoritos={setCantidadFavoritos}
                setCantidadReceta={setCantidadReceta}
                cantidadReceta={cantidadReceta}
              />
            ) : (
              <PerfilOther
                userName={username}
                cantidadReceta={cantidadReceta}
              />
            )
          ) : null}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          {cantidadFavoritos !== null && cantidadFavoritos !== undefined ? (
            getStorageUser().username.toLowerCase() ===
            username.toLowerCase() ? (
              <Favourites
                userName={username}
                setCantidadFavoritos={setCantidadFavoritos}
                cantidadFavoritos={cantidadFavoritos}
              />
            ) : (
              <FavouritesOther
                userName={username}
                setCantidadFavoritos={setCantidadFavoritos}
                cantidadFavoritos={cantidadFavoritos}
              />
            )
          ) : null}
        </CustomTabPanel>
      </Box>
      {openEditProfilePic && (
        <Modal
          open={openEditProfilePic}
          closeAfterTransition
          BackdropProps={{ timeout: 500 }}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: { xs: "90vw", sm: "70vw", md: "50vw" },
              maxWidth: 500,
              bgcolor: "background.paper",
              borderRadius: 3,
              boxShadow: 24,
              p: 4,
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <IconButton
              onClick={handleClose}
              sx={{ position: "absolute", top: 8, right: 8 }}
            >
              <CloseIcon />
            </IconButton>

            <Typography variant="h6" sx={{ mb: 2 }}>
              Cambiar foto de perfil
            </Typography>

            {loadingModalSubmit ? (
              <CircularProgress />
            ) : (
              <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                {image && (
                  <Box
                    sx={{
                      mb: 2,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Avatar
                      src={URL.createObjectURL(image)}
                      alt="Preview"
                      sx={{ width: 150, height: 150 }}
                      variant="rounded"
                    />
                  </Box>
                )}
                <Button
                  variant="contained"
                  component="label"
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  Seleccionar Imagen
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageChange}
                  />
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Subir Imagen
                </Button>
              </form>
            )}
          </Box>
        </Modal>
      )}
    </div>
  );
};

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ padding: "10px", minHeight: "50vh" }}>{children}</Box>
      )}
    </Box>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
