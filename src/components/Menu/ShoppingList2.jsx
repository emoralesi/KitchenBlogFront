import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AddIcon from "@mui/icons-material/Add";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PersonIcon from "@mui/icons-material/Person";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import BookmarkBorderIcon from "@mui/icons-material/Bookmark";

import {
  Avatar,
  Box,
  Button,
  Fab,
  Modal,
  Typography,
  Zoom,
  CircularProgress,
  Checkbox,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useReceta } from "../../Hooks/useReceta";
import { useUsuario } from "../../Hooks/useUsuario";
import { dateConvert } from "../../utils/dateConvert";
import IconSvg from "../../utils/IconSvg";
import { getStorageUser } from "../../utils/StorageUser";
import { DetailsReceta } from "./Seccion/DitailsReceta";
import { IngredientListModal } from "./IngredientListModal";
import useNearScreen from "../../Hooks/useNearScreen";
import debounce from "just-debounce-it";
import { SkeletonWave } from "../../utils/Skeleton";

export const ShoppingList2 = () => {
  const { ObtenerFavourites, favourites, cantidadFavoritos } = useUsuario();
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
  const [loading, setLoading] = useState(true);

  const [loadingNearScreen, setLoadingNearScreen] = useState(false);

  const externalRef = useRef();
  const { isNearScreen } = useNearScreen({
    externalRef: cantidadFavoritos == 0 ? null : externalRef,
    once: false,
  });

  const debounceHandleNextPage = useCallback(
    debounce(() => {
      if (favourites.length < cantidadFavoritos) {
        setPreviousLength(favourites.length);
        const newLimit = limit + 9;
        setLimit(newLimit);
        setLoadingNearScreen(true);
        ObtenerFavourites(
          {
            data: {
              data: {
                idUser: getStorageUser().usuarioId,
                page,
                limit: newLimit,
              },
            },
          },
          true
        ).finally(() => {
          setLoadingNearScreen(false);
        });
      }
    }, 250),
    [favourites]
  );

  useEffect(
    function () {
      if (isNearScreen && !loading) {
        debounceHandleNextPage();
      }
    },
    [isNearScreen]
  );

  useEffect(() => {
    ObtenerFavourites({
      data: { data: { idUser: getStorageUser().usuarioId, page, limit } },
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  const handleClickExpand = (cardId) => {
    setIsExpanded((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          px: 2,
          py: 1,
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{
            fontSize: {
              xs: "1.8rem",
              sm: "2rem",
              md: "2.5rem",
            },
            color: "text.primary",
          }}
        >
          Crea tu shopping list
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: "600px" }}
        >
          Selecciona una o varias recetas para generar una lista de compra con
          los ingredientes necesarios.
        </Typography>
      </Box>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <></>
      )}
      {favourites?.filter((value) => value._id).length == 0 &&
      loading == false ? (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="50vh"
          width="auto"
          textAlign="center"
          px={2}
        >
          <Typography variant="h5" color="textSecondary" gutterBottom>
            No has agregado ninguna receta a favoritos.
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Haz clic en el icono <BookmarkBorderIcon fontSize="large" /> de
            alguna receta para agregarla a favoritos y asi poden crear tu
            shopping list.
          </Typography>
        </Box>
      ) : (
        <></>
      )}
      {favourites ? (
        <Box
          sx={{
            display: "grid",
            gap: "15px",
            marginLeft: "10px",
            marginRight: "10px",
            marginBottom: "10px",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            },
          }}
        >
          {favourites
            ?.filter((value) => value._id)
            .map((card, index) => {
              const isNew = index >= previousLength;
              const animationIndex = isNew ? index - previousLength : 0;
              return (
                <Zoom
                  key={card._id}
                  in={true}
                  timeout={300}
                  style={{
                    transitionDelay: isNew
                      ? `${animationIndex * 100}ms`
                      : "0ms",
                  }}
                >
                  <Box
                    sx={{
                      borderRadius: 2,
                      boxShadow: 3,
                      overflow: "hidden",
                      display: "flex",
                      maxHeight: "70vh",
                      flexDirection: "column",
                      bgcolor: "background.paper",
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        height: isExpanded[card._id] ? "0%" : "50%",
                        transition: "ease-in-out 0.5s",
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
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
                          p: 0,
                          width: "100%",
                          height: 200,
                          position: "relative",
                          overflow: "hidden",
                          "&:hover .overlay": {
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                          },
                          "&:hover .text": {
                            opacity: 1,
                          },
                        }}
                      >
                        <img
                          src={card.images[0]}
                          alt="Imagen"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
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
                            opacity: 0,
                            transition: "opacity 0.3s ease",
                            fontWeight: "bold",
                          }}
                        >
                          Ver Más
                        </Typography>
                      </Button>
                      <Fab
                        aria-label="add"
                        onClick={() => handleClickExpand(card?._id)}
                        sx={{
                          position: "absolute",
                          bottom: -16,
                          left: "50%",
                          transform: "translateX(-50%)",
                          height: 30,
                          width: 30,
                          minHeight: "unset",
                          backgroundColor: "white",
                          color: "black",
                          boxShadow: 1,
                        }}
                      >
                        {isExpanded[card._id] ? (
                          <RemoveCircleIcon />
                        ) : (
                          <AddIcon />
                        )}
                      </Fab>
                    </Box>
                    <Box
                      sx={{
                        px: 2,
                        paddingTop: "10px",
                        pb: 2,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        height: isExpanded[card._id] ? "100%" : "60%",
                        transition: "ease-in-out 0.5s",
                        backgroundColor: "white",
                        overflow: isExpanded[card._id] ? "auto" : "none",
                        scrollbarWidth: "thin",
                        clipPath: "border-box",
                      }}
                    >
                      <Box
                        sx={{
                          height: isExpanded[card._id] ? 0 : "20%",
                          opacity: isExpanded[card._id] ? 0 : 1,
                          transition: "height 0.5s ease, opacity 0.5s ease",
                          alignItems: "center",
                          justifyContent: "space-between",
                          display: "flex",
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Button
                            onClick={() => {
                              navigate(
                                `/main/profile/${card.user[0].username}`
                              );
                            }}
                          >
                            <Avatar
                              sx={{
                                width: 50,
                                height: 50,
                                fontSize: 40,
                              }}
                              src={card.user[0].profileImageUrl}
                            >
                              {card.user[0].username
                                ?.substring(0, 1)
                                .toUpperCase()}
                            </Avatar>
                          </Button>
                          <Typography
                            sx={{
                              fontWeight: "bold",
                              height: isExpanded[card._id] ? 0 : "auto",
                              opacity: isExpanded[card._id] ? 0 : 1,
                              overflow: "hidden",
                              transition:
                                "opacity 0.5s ease-in-out, height 0.3s ease",
                            }}
                          >
                            {card.user[0].username}
                          </Typography>
                        </Box>
                        <Checkbox
                          defaultChecked
                          color="success"
                          checked={idSelected.includes(card._id)}
                          onChange={(e) => {
                            const result = e.target.checked
                              ? [...idSelected, card._id]
                              : idSelected.filter(
                                  (favourite) => favourite !== card._id
                                );

                            setidSelected(result);
                          }}
                        />
                      </Box>
                      <Typography variant="h6" fontWeight="bold">
                        {card.titulo}
                      </Typography>

                      <Box display="flex" justifyContent="space-between">
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <AccessTimeIcon fontSize="small" />
                          <Typography variant="body2">
                            {card.hours > 0
                              ? `${card.hours}h ${card.minutes}m`
                              : `${card.minutes}m`}
                          </Typography>
                        </Box>
                        <Typography variant="body2">
                          {dateConvert(card.fechaReceta)}
                        </Typography>
                      </Box>

                      <Box
                        display="flex"
                        justifyContent="space-between"
                        flexWrap="wrap"
                      >
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <PersonIcon fontSize="small" />
                          <Typography variant="body2">
                            {card.cantidadPersonas}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <AssignmentIcon fontSize="small" />
                          <Typography variant="body2">
                            {card.dificultad[0].nombreDificultad}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <RestaurantIcon fontSize="small" />
                          <Typography variant="body2">
                            {card.categoria[0].nombreCategoria}
                          </Typography>
                        </Box>
                      </Box>

                      <Box display="flex" flexWrap="wrap" gap={1}>
                        {card.subCategoria
                          .slice()
                          .sort((a, b) =>
                            a.nombreSubCategoria.localeCompare(
                              b.nombreSubCategoria
                            )
                          )
                          .map((value) => IconSvg(value.nombreSubCategoria))}
                      </Box>

                      <Typography variant="body2" color="text.secondary">
                        {card.descripcion}
                      </Typography>

                      {isExpanded[card._id] && (
                        <>
                          <Typography variant="subtitle2" fontWeight="bold">
                            INGREDIENTS
                          </Typography>
                          {card.grupoIngrediente.map((grupo) => (
                            <Box key={grupo.nombreGrupo} mt={1}>
                              <Typography variant="body2" fontWeight="bold">
                                {grupo.nombreGrupo}
                              </Typography>
                              {grupo.item.map((item, idx) => (
                                <Typography key={idx} variant="body2">
                                  {`${item.valor} ${
                                    item.medida.nombreMedida === "Quantity"
                                      ? ""
                                      : item.medida.nombreMedida
                                  } ${item.ingrediente.nombreIngrediente}`}
                                </Typography>
                              ))}
                            </Box>
                          ))}
                        </>
                      )}
                    </Box>
                  </Box>
                </Zoom>
              );
            })}
          {loadingNearScreen ? <SkeletonWave /> : <></>}
          {favourites.length > 8 ? (
            <div id="visor" ref={externalRef}></div>
          ) : (
            <></>
          )}
        </Box>
      ) : (
        <></>
      )}
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
    </Box>
  );
};
