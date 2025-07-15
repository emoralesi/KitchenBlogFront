import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AddIcon from "@mui/icons-material/Add";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PersonIcon from "@mui/icons-material/Person";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import {
  Avatar,
  Box,
  Button,
  Fab,
  Modal,
  Typography,
  Zoom,
  Checkbox,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useReceta } from "../../Hooks/useReceta";
import { useUsuario } from "../../Hooks/useUsuario";
import { dateConvert } from "../../utils/dateConvert";
import IconSvg from "../../utils/IconSvg";
import { getStorageUser } from "../../utils/StorageUser";
import { DetailsReceta } from "./Seccion/DitailsReceta";
import { IngredientListModal } from "./IngredientListModal";

export const ShoppingList2 = () => {
  const { ObtenerFavourites, favourites } = useUsuario();
  const {
    ObtenerRecetasInfo,
    recetasInfo,
    cantidadReceta,
    saveUpdateReactionReceta,
  } = useReceta();

  const [openReceta, setOpenReceta] = useState(false);
  const [idReceta, setIdReceta] = useState(null);
  const [isExpanded, setIsExpanded] = useState({});
  const [idSelected, setidSelected] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9);
  const [openIngredientList, setOpenIngredientList] = useState(false);
  const [previousLength, setPreviousLength] = useState(0);

  useEffect(() => {
    ObtenerFavourites({
      data: { data: { idUser: getStorageUser().usuarioId, page, limit } },
    });
  }, []);

  const handleClickExpand = (cardId) => {
    setIsExpanded((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  return (
    <div style={{ marginLeft: "15px", marginRight: "15px" }}>
      <h1>SELECT YOUR SHOPPING LIST</h1>
      <Box
        sx={{
          display: "grid",
          gap: "15px",
          gridTemplateColumns: {
            xs: "1fr", // mobile: 1 item por fila
            sm: "repeat(2, 1fr)", // pantallas medianas: 2 items por fila
            md: "repeat(3, 1fr)", // pantallas grandes: 3 items por fila
          },
        }}
      >
        {favourites
          ?.sort((a, b) => {
            if (a.pined !== b.pined) {
              return b.pined - a.pined;
            }
            return new Date(b.fechaReceta) - new Date(a.fechaReceta);
          })
          .map((card, index) => {
            const isNew = index >= previousLength;
            const animationIndex = isNew ? index - previousLength : 0;
            return (
              <Zoom
                key={card._id}
                in={true}
                timeout={300}
                style={{
                  transitionDelay: isNew ? `${animationIndex * 100}ms` : "0ms",
                }}
              >
                <Box
                  sx={{
                    p: 0,
                    border: 1,
                    position: "relative",
                    borderRadius: 2,
                    maxHeight: "54vh",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      height: isExpanded[card._id] ? "0%" : "50%",
                      transition: "ease-in-out 0.5s",
                      position: "relative",
                    }}
                  >
                    <Button
                      onClick={() => {
                        setIdReceta(card?._id);
                        window.history.replaceState(
                          "",
                          "",
                          `/main/p/${card._id}`
                        );
                        setOpenReceta(true);
                      }}
                      sx={{
                        width: "100%",
                        height: "100%",
                        p: 0,
                        position: "relative", // Necesario para posicionar el texto en el centro
                        overflow: "hidden", // Asegura que el contenido extra no se salga del botón
                        "&:hover .overlay": {
                          backgroundColor: "rgba(0, 0, 0, 0.5)", // Oscurece el contenido en hover
                        },
                        "&:hover .text": {
                          opacity: 1, // Muestra el texto en hover
                        },
                      }}
                    >
                      <img
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "8px 8px 0px 0px",
                        }}
                        srcSet={card ? card.images[0] : null}
                        src={card ? card.images[0] : null}
                        alt="Imagen"
                        loading="lazy"
                      />
                      <Box
                        className="overlay"
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          backgroundColor: "rgba(0, 0, 0, 0)", // Transparente por defecto
                          transition: "background-color 0.3s ease", // Suaviza la transición del color de fondo
                        }}
                      />
                      <Typography
                        className="text"
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          color: "white",
                          opacity: 0, // Oculto por defecto
                          transition: "opacity 0.3s ease", // Suaviza la transición de la opacidad
                          fontWeight: "bold",
                        }}
                      >
                        See more
                      </Typography>
                    </Button>
                    <div
                      style={{
                        position: "absolute",
                        left: 5,
                        top: 5,
                        display: "flex",
                        alignItems: "center",
                        paddingRight: "10px",
                        backgroundColor: "white",
                      }}
                    >
                      <Button
                        onClick={() => {
                          navigate(`/main/profile/${card.user[0].username}`);
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 50,
                            height: 50,
                            marginRight: "10px",
                            fontSize: 40,
                          }}
                          src={card.user[0].profileImageUrl}
                        >
                          {card.user[0].username?.substring(0, 1).toUpperCase()}
                        </Avatar>
                      </Button>
                      <p style={{ fontWeight: "bold" }}>
                        {card.user[0].username}
                      </p>
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        right: 5,
                        top: 5,
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "white",
                        border: "solid black",
                      }}
                    >
                      <Checkbox
                        defaultChecked
                        color="success"
                        checked={idSelected.includes(card._id)}
                        onChange={(e) => {
                          var result = [];
                          e.target.checked
                            ? (result = [...idSelected, card._id])
                            : (result = idSelected.filter(
                                (favourite) => favourite != card._id
                              ));

                          setidSelected(result);
                        }}
                      />
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        zIndex: 1, // Para asegurar que el Fab esté sobre los demás elementos
                      }}
                    >
                      <Fab
                        aria-label="add"
                        onClick={() => {
                          handleClickExpand(card?._id);
                        }}
                        sx={{
                          height: "30px",
                          width: "30px",
                          minHeight: "unset",
                          color: "black",
                          boxShadow: "unset",
                          backgroundColor: "white",
                        }}
                      >
                        {isExpanded[card?._id] ? (
                          <RemoveCircleIcon />
                        ) : (
                          <AddIcon />
                        )}
                      </Fab>
                    </div>
                  </Box>
                  <Box
                    sx={{
                      width: "100%",
                      height: isExpanded[card._id] ? "100%" : "50%",
                      transition: "ease-in-out 0.5s",
                      backgroundColor: "white", // Fondo blanco
                      borderRadius: "0px 0px 8px 8px",
                      overflow: isExpanded[card._id] ? "auto" : "none",
                      scrollbarWidth: "thin",
                      clipPath: "border-box",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex", // Usar flexbox para centrar el contenido
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <ul
                        style={{
                          height: "100%",
                          padding: "0px 10px 0px 10px",
                          margin: 0,
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <h3>{card?.titulo}</h3>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            height: "15px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <AccessTimeIcon />
                            <p>
                              {card?.hours > 0
                                ? card?.hours + "h " + card?.minutes + "m"
                                : card?.minutes + "M"}
                            </p>
                          </div>
                          <p>{dateConvert(card?.fechaReceta)}</p>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <PersonIcon />
                            <p>{card?.cantidadPersonas}</p>
                          </div>
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <AssignmentIcon />
                            <p>{card?.dificultad[0].nombreDificultad}</p>
                          </div>
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <RestaurantIcon />
                            <p>{card?.categoria[0].nombreCategoria}</p>
                          </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center" }}>
                          {card?.subCategoria
                            ?.slice()
                            .sort((a, b) =>
                              a.nombreSubCategoria.localeCompare(
                                b.nombreSubCategoria
                              )
                            )
                            .map((value) => IconSvg(value.nombreSubCategoria))}
                        </div>

                        <p>{dateConvert(card?.fechaReceta)}</p>
                        <p>{card?.descripcion}</p>

                        <h3>INGREDIENTS</h3>
                        {card?.grupoIngrediente?.map((value) => (
                          <div key={value.nombreGrupo}>
                            <h4>{value.nombreGrupo}</h4>
                            {value.item.map((value2, index) => (
                              <p>{`${value2.valor} ${
                                value2.medida.nombreMedida == "Quantity"
                                  ? ""
                                  : value2.medida.nombreMedida
                              } ${value2.ingrediente.nombreIngrediente}`}</p>
                            ))}
                          </div>
                        ))}
                      </ul>
                    </div>
                  </Box>
                </Box>
              </Zoom>
            );
          })}
        {favourites?.length == 0 ? <h4>Not Recetas Founded</h4> : <></>}
      </Box>
      {openReceta ? (
        <Modal
          open={openReceta}
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
          <DetailsReceta
            isFull={false}
            isFromProfile={true}
            idReceta={idReceta}
            setOpen={setOpenReceta}
            idUser={getStorageUser().usuarioId}
            username={getStorageUser().username}
          />
        </Modal>
      ) : (
        <></>
      )}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
        }}
      >
        <Button
          onClick={() => {
            setOpenIngredientList(true);
          }}
          color="success"
          variant="contained"
        >
          Generate list
        </Button>
      </div>
      {openIngredientList ? (
        <IngredientListModal
          data={favourites.filter((recipe) => idSelected.includes(recipe._id))}
          open={openIngredientList}
          setOpen={setOpenIngredientList}
        />
      ) : (
        <></>
      )}
    </div>
  );
};
