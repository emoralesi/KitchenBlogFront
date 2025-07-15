import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AddIcon from "@mui/icons-material/Add";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import CachedIcon from "@mui/icons-material/Cached";
import CommentIcon from "@mui/icons-material/Comment";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PersonIcon from "@mui/icons-material/Person";
import PushPinIcon from "@mui/icons-material/PushPin";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Fab,
  IconButton,
  Modal,
  Typography,
  Zoom,
} from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
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
import { RecetaForm } from "./RecetaForm";
import { UpdateRecetaForm } from "./UpdateRecetaForm";

export const PerfilOwner = ({
  setCantidadFavoritos,
  setCantidadReceta,
  cantidadReceta,
}) => {
  const [openConfirmation, setOpenConfirmation] = useState(false);

  const handleClickOpenConfirmation = () => {
    setOpenConfirmation(true);
  };

  const handleCloseConfirmation = () => {
    setOpenConfirmation(false);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const openMore = Boolean(anchorEl);
  const handleClickMore = (event, card) => {
    setAnchorEl(event.currentTarget);
    setCurrentCard(card); // Establece el card actual
  };

  const handleCloseMore = () => {
    setAnchorEl(null);
    setCurrentCard(null); // Limpia el card actual
  };

  const handleClickExpand = (cardId) => {
    setIsExpanded((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  const [openForm, setOpenForm] = useState(false);
  const [openUpdateForm, setOpenUpdateForm] = useState(false);
  const {
    getUserAndReceta,
    misRecetas,
    setMisRecetas,
    actualizarPined,
    desactivarReceta,
    saveUpdateReactionReceta,
    reactionInfo,
    favouriteInfo,
    setFavouriteInfo,
    setReactionInfo,
  } = useReceta();
  const {
    ObtenerIdFavourites,
    idFavourites,
    setIdFavourites,
    SaveUpdateMyFavourites,
    ObtenerDataFavAndRec,
  } = useUsuario();
  const [openReceta, setOpenReceta] = useState(false);
  const [idReceta, setIdReceta] = useState(null);
  const [UpdateId, setUpdateId] = useState(null);
  const [currentCard, setCurrentCard] = useState(null);
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

  const ITEM_HEIGHT = 48;

  const debounceHandleNextPage = useCallback(
    debounce(() => {
      if (misRecetas.length < cantidadReceta) {
        const newLimit = limit + 9;
        setPreviousLength(misRecetas.length);
        setLimit(newLimit);
        setLoadingNearScreen(true);
        getUserAndReceta({
          data: {
            userId: getStorageUser().usuarioId,
            page: 1,
            limit: newLimit,
          },
        }).finally(() => {
          setLoadingNearScreen(false);
        });
      }
    }, 250),
    [misRecetas]
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
    getUserAndReceta({
      data: { userId: getStorageUser().usuarioId, page, limit },
    }).finally((res) => {
      setLoading(false);
    });

    ObtenerIdFavourites({ idUser: getStorageUser().usuarioId });
  }, []);

  const handleBookmarkClick = async (id, action) => {
    var result = [];
    await SaveUpdateMyFavourites({
      body: {
        idUser: getStorageUser().usuarioId,
        idReceta: id,
        estado: action,
      },
    }).then((res) => {
      action
        ? setCantidadFavoritos((prevCantidad) => prevCantidad + 1)
        : setCantidadFavoritos((prevCantidad) => prevCantidad - 1);
    });
    action
      ? (result = [...idFavourites, id])
      : (result = idFavourites.filter((favourite) => favourite != id));
    setIdFavourites(result);
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
      <Fab
        color="success"
        aria-label="add"
        sx={{
          position: "fixed",
          bottom: 25,
          right: 25,
          width: "60px",
          height: "60px",
        }}
        onClick={() => {
          setOpenForm(true);
        }}
      >
        <AddIcon />
      </Fab>
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
            No has creado ninguna receta de momento
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Haz clic en el botón verde <strong>+</strong> para agregar una
            receta.
          </Typography>
        </Box>
      ) : (
        <></>
      )}
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
        {misRecetas
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
                    {card?.pined ? (
                      <div
                        style={{
                          position: "absolute",
                          right: 0,
                          top: -10,
                          display: "flex",
                          alignItems: "center",
                          rotate: "20px",
                        }}
                      >
                        <PushPinIcon sx={{ fontSize: "25px" }} />
                      </div>
                    ) : (
                      <></>
                    )}

                    <div
                      style={{
                        position: "absolute",
                        right: 2,
                        top: 1,
                        display: "flex",
                        alignItems: "center",
                        backdropFilter: "blur(10px)",
                        height: "100%",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <IconButton
                            onClick={() => {
                              handleBookmarkClick(
                                card._id,
                                !favouriteInfo
                                  ?.find((value) => value.idReceta === card._id)
                                  .usuarios_id_favourite.some(
                                    (user) => user == getStorageUser().usuarioId
                                  )
                              );

                              const receta = favouriteInfo?.find(
                                (value) => value.idReceta === card._id
                              );

                              const userExists =
                                receta.usuarios_id_favourite.some(
                                  (value) => value == getStorageUser().usuarioId
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
                                  item.idReceta === card._id
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
                          <p>
                            {
                              favouriteInfo?.find(
                                (value) => value.idReceta === card._id
                              ).usuarios_id_favourite?.length
                            }
                          </p>
                        </div>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <IconButton
                            onClick={() => {
                              saveUpdateReactionReceta({
                                data: {
                                  idReceta: card?._id,
                                  idUser: getStorageUser().usuarioId,
                                  estado: !reactionInfo
                                    .find(
                                      (value) => value.idReceta === card?._id
                                    )
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

                              const userExists =
                                receta.usuarios_id_reaction.some(
                                  (value) =>
                                    value === getStorageUser().usuarioId
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
                                  ?.find(
                                    (value) => value.idReceta === card?._id
                                  )
                                  .usuarios_id_reaction.some(
                                    (value) =>
                                      value == getStorageUser().usuarioId
                                  )
                                  ? "red"
                                  : "gray",
                                transition: "color 0.5s",
                              }}
                            />
                          </IconButton>
                          <span>
                            {
                              reactionInfo?.find(
                                (value) => value.idReceta === card?._id
                              ).usuarios_id_reaction.length
                            }
                          </span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center" }}>
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
                            <CommentIcon
                              sx={{ color: "blue", width: "34px" }}
                            />
                          </IconButton>
                          <p>{card?.comments.length}</p>
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <IconButton
                        aria-label="more"
                        aria-controls={anchorEl ? "long-menu" : undefined}
                        aria-expanded={Boolean(anchorEl)}
                        aria-haspopup="true"
                        onClick={(event) => handleClickMore(event, card)}
                      >
                        <MoreVertIcon
                          fontSize="large"
                          sx={{ color: "black" }}
                        />
                      </IconButton>
                      <Menu
                        id="long-menu"
                        anchorEl={anchorEl}
                        open={
                          Boolean(anchorEl) && currentCard?._id === card._id
                        }
                        onClose={handleCloseMore}
                        PaperProps={{
                          style: {
                            maxHeight: ITEM_HEIGHT * 4.5,
                            width: "20ch",
                          },
                        }}
                      >
                        <MenuItem
                          onClick={(e) => {
                            setUpdateId(card._id);
                            setOpenUpdateForm(true);
                            handleCloseMore();
                          }}
                          sx={{ height: "50px" }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <div style={{ marginRight: "10px" }}>
                              <CachedIcon />
                            </div>
                            <h4>UPDATE</h4>
                          </div>
                        </MenuItem>
                        <MenuItem
                          onClick={async (e) => {
                            // Primero, actualizamos el estado local
                            await handleCloseMore();

                            const updatedArray = misRecetas.map((item) =>
                              item._id === card._id
                                ? { ...item, pined: !card.pined }
                                : item
                            );
                            setMisRecetas(updatedArray);

                            // Luego, obtenemos el nuevo estado de "pined" para este elemento
                            const updatedCard = updatedArray.find(
                              (item) => item._id === card._id
                            );

                            // Llamamos a la función para actualizar la base de datos
                            await actualizarPined(card._id, updatedCard.pined);
                          }}
                          sx={{ height: "50px" }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <div style={{ marginRight: "10px" }}>
                              {card?.pined ? (
                                <PushPinIcon />
                              ) : (
                                <PushPinOutlinedIcon />
                              )}
                            </div>
                            {card?.pined ? <h4>UNPIN</h4> : <h4>PIN</h4>}
                          </div>
                        </MenuItem>
                        <MenuItem
                          sx={{ color: "red", height: "50px" }}
                          onClick={() => {
                            handleClickOpenConfirmation();
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <div style={{ marginRight: "10px" }}>
                              <DeleteIcon />
                            </div>
                            <h4>DELETE</h4>
                          </div>

                          <Dialog
                            open={openConfirmation}
                            onClose={handleCloseConfirmation}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                            slotProps={{
                              backdrop: {
                                sx: {
                                  backgroundColor: "rgba(0, 0, 0, 0.2)",
                                },
                              },
                            }}
                          >
                            <div
                              style={{
                                padding: "16px 24px",
                                fontFamily: "sans-serif",
                              }}
                            >
                              <h3 style={{ fontWeight: 500 }}>
                                Estas seguro que quieres eliminar esta receta ?
                              </h3>
                              <h1>{card.titulo}</h1>
                            </div>
                            <DialogContent>
                              <DialogContentText id="alert-dialog-description">
                                Click on DELETE to delete this Recipe otherwise
                                Click on CANCEL
                              </DialogContentText>
                            </DialogContent>
                            <DialogActions sx={{ gap: "25px" }}>
                              <Button
                                variant="outlined"
                                onClick={handleCloseConfirmation}
                              >
                                CANCEL
                              </Button>
                              <Button
                                sx={{ marginRight: "15px" }}
                                variant="contained"
                                color="error"
                                onClick={async (e) => {
                                  await desactivarReceta({
                                    recetaId: card._id,
                                  });
                                  await getUserAndReceta({
                                    data: {
                                      userId: getStorageUser().usuarioId,
                                      page,
                                      limit,
                                    },
                                  }).then((res) => {});
                                  handleCloseConfirmation();
                                  if (idFavourites.includes(card._id)) {
                                    setCantidadFavoritos(
                                      (prevCantidad) => prevCantidad - 1
                                    );
                                  }
                                }}
                              >
                                DELETE
                              </Button>
                            </DialogActions>
                          </Dialog>
                        </MenuItem>
                      </Menu>
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
                      overflow: isExpanded[card._id] ? "auto" : "none", // Centra el contenido horizontalmente
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
                            width: "100%",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginBottom: "10px",
                              flexWrap: "wrap",
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
        {loadingNearScreen ? <SkeletonWave /> : <></>}
        {misRecetas.length > 8 ? (
          <div id="visor" ref={externalRef}></div>
        ) : (
          <></>
        )}
      </Box>
      {openForm ? (
        <RecetaForm
          setCantidadReceta={setCantidadReceta}
          open={openForm}
          getUserAndReceta={getUserAndReceta}
          setOpen={setOpenForm}
          setReactionInfo={setReactionInfo}
          setFavouriteInfo={setFavouriteInfo}
          page={page}
          limit={limit}
        />
      ) : (
        <></>
      )}
      {openUpdateForm ? (
        <UpdateRecetaForm
          setCantidadReceta={setCantidadReceta}
          open={openUpdateForm}
          getUserAndReceta={getUserAndReceta}
          setOpen={setOpenUpdateForm}
          recetaId={UpdateId}
          page={page}
          limit={limit}
          setReactionInfo={setReactionInfo}
          setFavouriteInfo={setFavouriteInfo}
        />
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
    </Box>
  );
};
