import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AddIcon from "@mui/icons-material/Add";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import CommentIcon from "@mui/icons-material/Comment";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PersonIcon from "@mui/icons-material/Person";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Fab,
  IconButton,
  Modal,
  Typography,
  Zoom,
} from "@mui/material";
import debounce from "just-debounce-it";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useNearScreen from "../../../Hooks/useNearScreen";
import { useReceta } from "../../../Hooks/useReceta";
import { useUsuario } from "../../../Hooks/useUsuario";
import { dateConvert } from "../../../utils/dateConvert";
import { TypeNotification } from "../../../utils/enumTypeNoti";
import IconSvg from "../../../utils/IconSvg";
import { SkeletonWave } from "../../../utils/Skeleton";
import { getStorageUser } from "../../../utils/StorageUser";
import { DetailsReceta } from "../Others/DitailsReceta";
import { getCloudinaryUrl } from "../../../utils/GetCloudinaryUrl";

export const Favourites = ({
  userName,
  setCantidadFavoritos,
  cantidadFavoritos,
}) => {
  const navigate = useNavigate();
  const externalRef = useRef();
  const { isNearScreen } = useNearScreen({
    externalRef: cantidadFavoritos == 0 ? null : externalRef,
    once: false,
  });

  const {
    ObtenerFavourites,
    getIdUserByUserName,
    favourites,
    idFavourites,
    SaveUpdateMyFavourites,
    ObtenerIdFavourites,
    favouriteInfo,
    reactionInfo,
    setReactionInfo,
  } = useUsuario();
  const { saveUpdateReactionReceta } = useReceta();
  const [openReceta, setOpenReceta] = useState(false);
  const [idReceta, setIdReceta] = useState(null);
  const [idUsuario, setIdUsuario] = useState(null);
  const [isExpanded, setIsExpanded] = useState({});
  const [previousLength, setPreviousLength] = useState(0);

  const [loadingNearScreen, setLoadingNearScreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9);

  const handleBookmarkClick = async (id, action) => {
    await SaveUpdateMyFavourites({
      body: { idUser: idUsuario, idReceta: id, estado: action },
    });
    await ObtenerIdFavourites({ idUser: idUsuario });
    await ObtenerFavourites({
      data: { data: { idUser: idUsuario, page, limit } },
    });
    action
      ? setCantidadFavoritos((prevCantidad) => prevCantidad + 1)
      : setCantidadFavoritos((prevCantidad) => prevCantidad - 1);
  };

  const handleClickExpand = (cardId) => {
    setIsExpanded((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

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
    const fetchData = async () => {
      try {
        setIdUsuario(getStorageUser().usuarioId);
        await ObtenerFavourites({
          data: { data: { idUser: getStorageUser().usuarioId, page, limit } },
        });
        await ObtenerIdFavourites({ idUser: getStorageUser().usuarioId });
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData().finally(() => {
      setLoading(false);
    });
  }, [userName]);

  return (
    <Box>
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
            alguna receta para agregarla a favoritos.
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
                      <Box
                        sx={{
                          px: 1,
                          py: 1,
                          display: "flex",
                          justifyContent: "space-around",
                          alignItems: "center",
                          borderTop: "1px solid #eee",
                          bgcolor: "background.default",
                          height: isExpanded[card._id] ? "0%" : "10%",
                          transition: "ease-in-out 0.5s",
                        }}
                      >
                        <Box textAlign="center">
                          <IconButton
                            onClick={() => {
                              handleBookmarkClick(
                                card._id,
                                !favouriteInfo
                                  .find((value) => value.idReceta == card._id)
                                  .usuarios_id_favourite.some(
                                    (user) => user === idUsuario
                                  )
                              );

                              const receta = favouriteInfo.find(
                                (value) => value.idReceta === card?._id
                              );

                              const userExists =
                                receta.usuarios_id_favourite.some(
                                  (value) =>
                                    value === getStorageUser().usuarioId
                                );

                              let updatedUsuariosIdFavourite;

                              if (userExists) {
                                updatedUsuariosIdFavourite =
                                  receta.usuarios_id_favourite.filter(
                                    (value) =>
                                      value !== getStorageUser().usuarioId
                                  );
                              } else {
                                updatedUsuariosIdFavourite = [
                                  ...receta.usuarios_id_favourite,
                                  getStorageUser().usuarioId,
                                ];
                              }

                              const updatedFavouriteInfo = favouriteInfo.map(
                                (item) =>
                                  item.idReceta === card?._id
                                    ? {
                                        ...item,
                                        usuarios_id_favourite:
                                          updatedUsuariosIdFavourite,
                                      }
                                    : item
                              );

                              setFavouriteInfo(updatedFavouriteInfo);
                            }}
                            sx={{
                              transition: "color 0.3s",
                              padding: 0,
                              width: "40px",
                            }}
                          >
                            {idFavourites?.includes(card._id) ? (
                              <BookmarkIcon
                                fontSize="large"
                                sx={{ color: "yellow" }}
                              />
                            ) : (
                              <BookmarkBorderIcon fontSize="large" />
                            )}
                          </IconButton>
                          <Typography variant="caption">
                            {
                              favouriteInfo?.find(
                                (value) => value.idReceta == card._id
                              )?.usuarios_id_favourite.length
                            }
                          </Typography>
                        </Box>
                        <Box textAlign="center">
                          <IconButton
                            onClick={() => {
                              if (
                                saveUpdateReactionReceta({
                                  data: {
                                    idReceta: card?._id,
                                    idUser: idUsuario,
                                    estado: !reactionInfo
                                      .find(
                                        (value) => value.idReceta === card?._id
                                      )
                                      .usuarios_id_reaction.some(
                                        (value) => value === idUsuario
                                      ),
                                    type: TypeNotification.LikeToReceta,
                                  },
                                })
                              ) {
                                const receta = reactionInfo.find(
                                  (value) => value.idReceta === card?._id
                                );

                                const userExists =
                                  receta.usuarios_id_reaction.some(
                                    (value) => value === idUsuario
                                  );

                                let updatedUsuariosIdReaction;

                                if (userExists) {
                                  updatedUsuariosIdReaction =
                                    receta.usuarios_id_reaction.filter(
                                      (value) => value !== idUsuario
                                    );
                                } else {
                                  updatedUsuariosIdReaction = [
                                    ...receta.usuarios_id_reaction,
                                    idUsuario,
                                  ];
                                }

                                const updatedReactionInfo = reactionInfo.map(
                                  (item) =>
                                    item.idReceta === card?._id
                                      ? {
                                          ...item,
                                          usuarios_id_reaction:
                                            updatedUsuariosIdReaction,
                                        }
                                      : item
                                );

                                setReactionInfo(updatedReactionInfo);
                              }
                            }}
                            sx={{ width: "40px" }}
                          >
                            <FavoriteIcon
                              sx={{
                                color: reactionInfo
                                  .find((v) => v.idReceta === card?._id)
                                  ?.usuarios_id_reaction.includes(idUsuario)
                                  ? "red"
                                  : "gray",
                                transition: "color 0.5s",
                              }}
                            />
                          </IconButton>
                          <Typography variant="caption">
                            {
                              reactionInfo.find(
                                (value) => value.idReceta === card?._id
                              ).usuarios_id_reaction.length
                            }
                          </Typography>
                        </Box>
                        <Box textAlign="center">
                          <IconButton
                            onClick={() => {
                              setIdReceta(card?._id);
                              window.history.replaceState(
                                "",
                                "",
                                `/main/p/${card._id}`
                              );
                              setOpenReceta(true);
                            }}
                            sx={{ width: "40px" }}
                          >
                            <CommentIcon
                              sx={{ color: "blue", width: "30px" }}
                            />
                          </IconButton>
                          <Typography variant="caption">
                            {card?.comments.length}
                          </Typography>
                        </Box>
                      </Box>
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
                          src={getCloudinaryUrl(card.images[0], { width: 400 })}
                          alt="Imagen"
                          loading="lazy"
                          decoding="async"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                        <Box
                          className="overlay"
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            backgroundColor: "rgba(0, 0, 0, 0)",
                            transition: "background-color 0.3s ease",
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
                        onClick={() => {
                          handleClickExpand(card?._id);
                        }}
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
                        {isExpanded[card?._id] ? (
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
                            INGREDIENTES
                          </Typography>
                          {card.grupoIngrediente.map((grupo) => (
                            <Box key={grupo.nombreGrupo} mt={1}>
                              <Typography variant="body2" fontWeight="bold">
                                {grupo.nombreGrupo}
                              </Typography>
                              {grupo.item.map((item, idx) => {
                                const tienePresentacion =
                                  item.presentacion?.nombrePresentacion;
                                const textoPresentacion = tienePresentacion
                                  ? ` (${tienePresentacion})`
                                  : "";

                                const alternativas = item.alternativas?.length
                                  ? item.alternativas
                                      .map(
                                        (alt) => ` / ${alt.nombreIngrediente}`
                                      )
                                      .join("")
                                  : "";

                                return (
                                  <Typography key={idx} variant="body2">
                                    {`${item.valor} ${
                                      item.medida.nombreMedida === "Cantidad"
                                        ? ""
                                        : item.medida.nombreMedida
                                    } ${
                                      item.ingrediente.nombreIngrediente
                                    }${textoPresentacion}${alternativas}`}
                                  </Typography>
                                );
                              })}
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
        <h1>No se ecnontraron Favoritos</h1>
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
            isFromProfile={false}
            origen={"myFavourites"}
            idReceta={idReceta}
            setOpen={setOpenReceta}
            idUser={idUsuario}
          />
        </Modal>
      ) : (
        <></>
      )}
    </Box>
  );
};
