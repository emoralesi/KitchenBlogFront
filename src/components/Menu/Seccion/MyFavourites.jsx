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
import { DetailsReceta } from "./DitailsReceta";

export const Favourites = ({
  userName,
  setCantidadFavoritos,
  cantidadFavoritos,
}) => {
  const navigate = useNavigate();

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
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9);
  const [previousLength, setPreviousLength] = useState(0);

  const [loadingNearScreen, setLoadingNearScreen] = useState(false);
  const [loading, setLoading] = useState(true);

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
            gridTemplateColumns: {
              xs: "1fr", // mobile: 1 item por fila
              sm: "repeat(2, 1fr)", // pantallas medianas: 2 items por fila
              md: "repeat(3, 1fr)", // pantallas grandes: 3 items por fila
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
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Box
                        sx={{
                          height: isExpanded[card._id] ? 0 : "20%",
                          opacity: isExpanded[card._id] ? 0 : 1,
                          transition: "height 0.5s ease, opacity 0.5s ease",
                          alignItems: "center",
                          padding: isExpanded[card._id] ? 0 : "8px",
                          backgroundColor: "white",
                          display: "flex",
                          zIndex: 2,
                          margin: "3px 0px 3px 0px",
                        }}
                      >
                        <Button
                          onClick={() => {
                            navigate(`/main/profile/${card.user[0].username}`);
                          }}
                          sx={{ padding: 0, marginRight: 1 }}
                        >
                          <Avatar
                            sx={{ width: 50, height: 50, fontSize: 40 }}
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
                          width: "calc(100% - 60px)",
                          marginLeft: "5px",
                          flexGrow: 1,
                          p: 0,
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
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "0 0 8px 8px",
                          }}
                          srcSet={card?.images[0]}
                          src={card?.images[0]}
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
                          See more
                        </Typography>
                      </Button>
                      <div
                        style={{
                          position: "absolute",
                          right: 2,
                          top: 50,
                          display: "grid",
                          gridTemplateColumns: "auto auto",
                          alignItems: "center",
                          columnGap: "0px",
                          rowGap: "10px",
                          width: "60px",
                        }}
                      >
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
                        <p style={{ margin: 0, textAlign: "left" }}>
                          {
                            favouriteInfo?.find(
                              (value) => value.idReceta == card._id
                            )?.usuarios_id_favourite.length
                          }
                        </p>
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
                        <span style={{ margin: 0, textAlign: "left" }}>
                          {
                            reactionInfo.find(
                              (value) => value.idReceta === card?._id
                            ).usuarios_id_reaction.length
                          }
                        </span>
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
                          <CommentIcon sx={{ color: "blue", width: "30px" }} />
                        </IconButton>
                        <p style={{ margin: 0, textAlign: "left" }}>
                          {card?.comments.length}
                        </p>
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          zIndex: 1,
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
                            zIndex: 3,
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
                              style={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <PersonIcon />
                              <p>{card?.cantidadPersonas}</p>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <AssignmentIcon />
                              <p>{card?.dificultad[0].nombreDificultad}</p>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <RestaurantIcon />
                              <p>{card?.categoria[0].nombreCategoria}</p>
                            </div>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            {card?.subCategoria
                              ?.slice()
                              .sort((a, b) =>
                                a.nombreSubCategoria.localeCompare(
                                  b.nombreSubCategoria
                                )
                              )
                              .map((value) =>
                                IconSvg(value.nombreSubCategoria)
                              )}
                          </div>
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
