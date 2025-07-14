import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { Avatar, IconButton, Modal, CircularProgress } from "@mui/material";
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
import { UserNotFound } from "./UserNotFound";

export const Bienvenido = () => {
  const username = "hannah"
  const [value, setValue] = useState(0);

  const [cantidadReceta, setCantidadReceta] = useState(null);
  const [cantidadFavoritos, setCantidadFavoritos] = useState(null);
  const [IdUser, setIdUser] = useState(null);
  const [userImage, setUserImage] = useState(null);

  const [openEditProfilePic, setOpenEditProfilePic] = useState(false);

  const { ObtenerDataFavAndRec, getIdUserByUserName } = useUsuario();

  const [userExists, setUserExists] = useState(true);
  const [loading, setLoading] = useState(true);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClose = () => {
    setOpenEditProfilePic(false);
    setImage(null);
  };

  const [image, setImage] = useState(null);

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!image) {
      console.error("No image selected");
      return;
    }

    const extension = image.name.split(".").pop();

    // Crear un nuevo archivo con el nombre deseado
    const renamedImage = new File([image], `${IdUser}.${extension}`, {
      type: image.type,
    });

    const formData = new FormData();
    formData.append("profileImage", renamedImage);
    formData.append("idUsuario", IdUser);
    formData.append("folderName", "Profiles_images");

    try {
      console.log("me cai despues del data");
      const requestOptions = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getStorageUser().token}`,
        },
        body: formData,
      };

      console.log("me cai despues del requestOption");

      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/upload-profile-image`,
        requestOptions
      )
        .then((res) => {
          Unauthorized(res.status);
          return res;
        })
        .then((res) => {
          return res;
        });

      console.log("Imagen subida:", response);
      // Puedes agregar lógica para actualizar la imagen del usuario si es necesario
    } catch (error) {
      console.error("Error al subir la imagen:", error);
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

        console.log("mi result resultadoso", result);

        setCantidadReceta(result.recetaCount);
        setCantidadFavoritos(result.favouriteCount);
      } catch (error) {
        console.error("Error fetching data", error);
        setUserExists(false); // Asumiendo que un error puede indicar que el usuario no existe
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [username, getIdUserByUserName, ObtenerDataFavAndRec]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!userExists) {
    return <UserNotFound />;
  }

  return (
    <div style={{ height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div
          style={{ width: "50%", display: "flex", justifyContent: "center" }}
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
            <Avatar
              sx={{
                width: 100,
                height: 100,
                fontSize: 80,
              }}
              src={userImage}
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
        <div style={{ width: "50%" }}>
          <div style={{ width: "100%" }}>
            <h2>{username}</h2>
          </div>
          <p>{`Recepies : ${cantidadReceta}`}</p>
          <p>{`Favourites: ${cantidadFavoritos}`}</p>
        </div>
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
          <PerfilOwner
            setCantidadFavoritos={setCantidadFavoritos}
            setCantidadReceta={setCantidadReceta}
            cantidadReceta={cantidadReceta}
          />
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
          BackdropProps={{
            timeout: 500,
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: { xs: "60vw", md: "60vw", lg: "60vw" },
              height: { xs: "85vh", md: "85vh", lg: "85vh" },
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <IconButton
              onClick={handleClose}
              sx={{ position: "absolute", top: 8, right: 8 }}
            >
              <CloseIcon />
            </IconButton>
            <div>
              <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleImageChange} />
                <button type="submit">Subir Imagen</button>
              </form>
            </div>
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
