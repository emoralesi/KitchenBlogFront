import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AddIcon from "@mui/icons-material/Add";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import CommentIcon from "@mui/icons-material/Comment";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PersonIcon from "@mui/icons-material/Person";
import PushPinIcon from "@mui/icons-material/PushPin";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import {
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
import useNearScreen from "../../../Hooks/useNearScreen";
import { useReceta } from "../../../Hooks/useReceta";
import { useUsuario } from "../../../Hooks/useUsuario";
import { dateConvert } from "../../../utils/dateConvert";
import { TypeNotification } from "../../../utils/enumTypeNoti";
import IconSvg from "../../../utils/IconSvg";
import { SkeletonWave } from "../../../utils/Skeleton";
import { getStorageUser } from "../../../utils/StorageUser";
import { DetailsReceta } from "./DitailsReceta";

export const PerfilOther = ({ userName, cantidadReceta }) => {
  const [openForm, setOpenForm] = useState(false);
  const {
    getUserAndReceta,
    misRecetas,
    saveUpdateReactionReceta,
    reactionInfo,
    favouriteInfo,
    setReactionInfo,
  } = useReceta();
  const [openReceta, setOpenReceta] = useState(false);
  const [idReceta, setIdReceta] = useState(null);
  const [idUser, setIdUser] = useState(null);
  const {
    getIdUserByUserName,
    ObtenerIdFavourites,
    SaveUpdateMyFavourites,
    idFavourites,
    setIdFavourites,
  } = useUsuario();
  const [isExpanded, setIsExpanded] = useState({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9);
  const [previousLength, setPreviousLength] = useState(0);

  const [loadingNearScreen, setLoadingNearScreen] = useState(false);
  const [loading, setLoading] = useState(true);

  const externalRef = useRef();
  const { isNearScreen } = useNearScreen({
    externalRef: cantidadReceta == 0 ? null : externalRef,
    once: false,
  });

  const debounceHandleNextPage = useCallback(
    debounce(() => {
      if (misRecetas.length < cantidadReceta) {
        const newLimit = limit + 9;
        setPreviousLength(misRecetas.length);
        setLimit(newLimit);
        setLoadingNearScreen(true);
        getUserAndReceta({
          data: { userId: idUser, page, limit: newLimit },
        }).finally(() => {
          setLoadingNearScreen(false);
        });
      }
    }, 250),
    [misRecetas]
  );

  useEffect(
    function () {
      if (isNearScreen) {
        debounceHandleNextPage();
      }
    },
    [isNearScreen]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const idUsuario = await getIdUserByUserName({
          username: userName,
        }).then((result) => {
          return result.userId;
        });
        setIdUser(idUsuario);
        await getUserAndReceta({ data: { userId: idUsuario, page, limit } });
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    ObtenerIdFavourites({ idUser: getStorageUser().usuarioId });
    fetchData().finally(() => {
      setLoading(false);
    });
  }, [userName]);

  const handleBookmarkClick = async (id, action) => {
    var result = [];
    await SaveUpdateMyFavourites({
      body: {
        idUser: getStorageUser().usuarioId,
        idReceta: id,
        estado: action,
      },
    });
    action
      ? (result = [...idFavourites, id])
      : (result = idFavourites.filter((favourite) => favourite != id));
    setIdFavourites(result);
  };

  const handleClickExpand = (cardId) => {
    setIsExpanded((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

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
      {misRecetas?.length == 0 && loading == false ? (
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
            {userName} no ha creado ninguna receta de momento.
          </Typography>
        </Box>
      ) : (
        <></>
      )}
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
        {misRecetas?.map((card, index) => {
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
                  position: "relative",
                  overflow: "visible",
                  borderRadius: 2,
                  boxShadow: 3,
                  display: "flex",
                  maxHeight: "70vh",
                  flexDirection: "column",
                  bgcolor: "background.paper",
                }}
              >
                {card?.pined && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: -10,
                      right: 0,
                      transform: "rotate(20deg)",
                      zIndex: 10,
                      pointerEvents: "none",
                    }}
                  >
                    <PushPinIcon sx={{ fontSize: "25px" }} />
                  </Box>
                )}
                <Box
                  sx={{
                    overflow: "hidden",
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
                                  (user) => user === getStorageUser().usuarioId
                                )
                            );

                            const receta = favouriteInfo.find(
                              (value) => value.idReceta === card?._id
                            );

                            const userExists =
                              receta.usuarios_id_favourite.some(
                                (value) => value === getStorageUser().usuarioId
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
                          sx={{ transition: "color 0.3s", padding: 0 }}
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
                            saveUpdateReactionReceta({
                              data: {
                                idReceta: card?._id,
                                idUser: getStorageUser().usuarioId,
                                estado: !reactionInfo
                                  .find((value) => value.idReceta === card?._id)
                                  .usuarios_id_reaction.some(
                                    (value) =>
                                      value === getStorageUser().usuarioId
                                  ),
                                type: TypeNotification.LikeToReceta,
                              },
                            });
                            const receta = reactionInfo.find(
                              (value) => value.idReceta === card?._id
                            );

                            const userExists = receta.usuarios_id_reaction.some(
                              (value) => value === getStorageUser().usuarioId
                            );

                            let updatedUsuariosIdReaction;

                            if (userExists) {
                              updatedUsuariosIdReaction =
                                receta.usuarios_id_reaction.filter(
                                  (value) =>
                                    value !== getStorageUser().usuarioId
                                );
                            } else {
                              updatedUsuariosIdReaction = [
                                ...receta.usuarios_id_reaction,
                                getStorageUser().usuarioId,
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
                          }}
                        >
                          <FavoriteIcon
                            sx={{
                              color: reactionInfo
                                .find((value) => value.idReceta === card?._id)
                                .usuarios_id_reaction.some(
                                  (value) => value == getStorageUser().usuarioId
                                )
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
                        >
                          <CommentIcon sx={{ color: "blue", width: "34px" }} />
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
                        See more
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
              </Box>
            </Zoom>
          );
        })}
        {loadingNearScreen ? <SkeletonWave /> : <></>}
        {misRecetas.length > 8 ? (
          <div id="visor" ref={externalRef}></div>
        ) : (
          <></>
        )}
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
            idUser={idUser}
            username={userName}
          />
        </Modal>
      ) : (
        <></>
      )}
    </Box>
  );
};
