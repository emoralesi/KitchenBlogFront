import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddIcon from '@mui/icons-material/Add';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import CachedIcon from '@mui/icons-material/Cached';
import CommentIcon from '@mui/icons-material/Comment';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonIcon from '@mui/icons-material/Person';
import PushPinIcon from '@mui/icons-material/PushPin';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, Fab, IconButton, Modal, SvgIcon, Typography, Zoom } from "@mui/material";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import debounce from 'just-debounce-it';
import { useCallback, useEffect, useRef, useState } from "react";
import useNearScreen from '../../../Hooks/useNearScreen';
import { useReceta } from "../../../Hooks/useReceta";
import { useUsuario } from '../../../Hooks/useUsuario';
import { dateConvert } from '../../../utils/dateConvert';
import { TypeNotification } from '../../../utils/enumTypeNoti';
import { getStorageUser } from "../../../utils/StorageUser";
import { DetailsReceta } from './DitailsReceta2';
import { RecetaForm } from "./RecetaForm";
import { UpdateRecetaForm } from './UpdateRecetaForm';
import IconSvg from '../../../utils/IconSvg';

export const PerfilOwner = ({ setCantidadFavoritos, setCantidadReceta, cantidadReceta }) => {

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
    setIsExpanded(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const [openForm, setOpenForm] = useState(false);
  const [openUpdateForm, setOpenUpdateForm] = useState(false);
  const { getUserAndReceta, misRecetas, setMisRecetas, actualizarPined, desactivarReceta, saveUpdateReactionReceta } = useReceta();
  const { ObtenerIdFavourites, idFavourites, setIdFavourites, SaveUpdateMyFavourites } = useUsuario();
  const [openReceta, setOpenReceta] = useState(false)
  const [idReceta, setIdReceta] = useState(null);
  const [UpdateId, setUpdateId] = useState(null);
  const [currentCard, setCurrentCard] = useState(null);
  const [isExpanded, setIsExpanded] = useState({});
  const [reactionInfo, setReactionInfo] = useState(null);
  const [favouriteInfo, setFavouriteInfo] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const externalRef = useRef()
  const { isNearScreen } = useNearScreen({
    externalRef: cantidadReceta == 0 ? null : externalRef,
    once: false
  })

  const ITEM_HEIGHT = 48;

  const debounceHandleNextPage = useCallback(debounce(
    () => {

      console.log("mi cantidad receta", cantidadReceta);
      console.log("mi recetas.length", misRecetas.length);
      console.log(cantidadReceta < misRecetas.length);

      if (misRecetas.length < cantidadReceta) {
        console.log("pase por el debounce");
        console.log("mi limit", limit);

        const newLimit = limit + 10;
        console.log("mi new limit", newLimit);

        setLimit(newLimit);
        getUserAndReceta({ data: { userId: getStorageUser().usuarioId, page: 1, limit: newLimit } }).then((res) => {

          setReactionInfo(res.Recetas?.map(recipe => {
            return {
              idReceta: recipe._id,
              usuarios_id_reaction: recipe.reactions.map(reaction => reaction.user_id)
            };
          }))

          setFavouriteInfo(res.Recetas?.map(recipe => {
            return {
              idReceta: recipe._id,
              usuarios_id_favourite: recipe.favourite
            }
          }))
        })
      }
    }, 250
  ), [misRecetas])

  useEffect(function () {
    if (isNearScreen) { debounceHandleNextPage() }
    console.log(isNearScreen);

  }, [isNearScreen])

  useEffect(() => {
    getUserAndReceta({ data: { userId: getStorageUser().usuarioId, page, limit } }).then((res) => {
      setReactionInfo(res.Recetas?.map(recipe => {
        return {
          idReceta: recipe._id,
          usuarios_id_reaction: recipe.reactions.map(reaction => reaction.user_id)
        };
      }))

      setFavouriteInfo(res.Recetas?.map(recipe => {
        return {
          idReceta: recipe._id,
          usuarios_id_favourite: recipe.favourite
        }
      }))
    })
    ObtenerIdFavourites({ idUser: getStorageUser().usuarioId })
  }, [])

  const handleBookmarkClick = async (id, action) => {

    var result = [];
    await SaveUpdateMyFavourites({ body: { idUser: getStorageUser().usuarioId, idReceta: id, estado: action } }).then((res) => {
      action ? setCantidadFavoritos(prevCantidad => prevCantidad + 1) : setCantidadFavoritos(prevCantidad => prevCantidad - 1)

    })
    action ? result = [...idFavourites, id] : result = idFavourites.filter(favourite => favourite != id)
    setIdFavourites(result);
  };

  return (
    <Box>
      <Fab
        color="success"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 25,
          right: 25,
          width: '60px',
          height: '60px'
        }}
        onClick={() => { setOpenForm(true) }}
      >
        <AddIcon />
      </Fab>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: '15px' }}>
        {misRecetas?.sort((a, b) => {
          if (a.pined !== b.pined) {
            return b.pined - a.pined;
          }
          return new Date(b.fechaReceta) - new Date(a.fechaReceta);
        })
          .map((card, index) => (
            <Zoom key={card._id} in={true} timeout={300 + (index * 10)}>
              <Box
                sx={{
                  p: 0,
                  border: 1,
                  position: 'relative',
                  borderRadius: 2,
                  height: '58vh',
                  display: 'flex', // Usar flexbox para organizar el contenido
                  flexDirection: 'column', // Colocar elementos en columnas
                }}
              >
                {/* Box que contiene la imagen */}
                <Box
                  sx={{
                    width: '100%',
                    height: isExpanded[card._id] ? '0%' : '50%',
                    transition: 'ease-in-out 0.5s',
                    position: 'relative'
                  }}
                >
                  <Button
                    onClick={() => {
                      setIdReceta(card?._id);
                      window.history.replaceState('', '', `/main/p/${card._id}`);
                      setOpenReceta(true);
                    }}
                    sx={{
                      width: '100%',
                      height: '100%',
                      p: 0,
                      position: 'relative', // Necesario para posicionar el texto en el centro
                      overflow: 'hidden', // Asegura que el contenido extra no se salga del botón
                      '&:hover .overlay': {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Oscurece el contenido en hover
                      },
                      '&:hover .text': {
                        opacity: 1, // Muestra el texto en hover
                      },
                    }}
                  >
                    <img
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '8px 8px 0px 0px',
                      }}
                      srcSet={card ? card.images[0] : null}
                      src={card ? card.images[0] : null}
                      alt="Imagen"
                      loading="lazy"
                    />

                    {/* Caja para la superposición oscura */}
                    <Box
                      className="overlay"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0)', // Transparente por defecto
                        transition: 'background-color 0.3s ease', // Suaviza la transición del color de fondo
                      }}
                    />

                    {/* Texto que aparece en el hover */}
                    <Typography
                      className="text"
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: 'white',
                        opacity: 0, // Oculto por defecto
                        transition: 'opacity 0.3s ease', // Suaviza la transición de la opacidad
                        fontWeight: 'bold',
                      }}
                    >
                      See more
                    </Typography>
                  </Button>
                  {card?.pined ? <div style={{ position: 'absolute', right: 0, top: -10, display: 'flex', alignItems: 'center', rotate: '20px' }}>
                    <PushPinIcon sx={{ fontSize: '25px' }} />
                  </div> : <></>}

                  <div style={{ position: 'absolute', right: 2, top: 25, display: 'flex', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                          onClick={() => {
                            console.log("-------------------------");

                            handleBookmarkClick(card._id, !favouriteInfo?.find(value => value.idReceta === card._id).usuarios_id_favourite.some((user) => user == getStorageUser().usuarioId));

                            const receta = favouriteInfo?.find(value => value.idReceta === card._id);

                            const userExists = receta.usuarios_id_favourite.some(value => value == getStorageUser().usuarioId);

                            let updatedUsuariosIdFavourite;

                            if (userExists) {
                              updatedUsuariosIdFavourite = receta.usuarios_id_favourite.filter(value => value !== getStorageUser().usuarioId);
                            } else {
                              updatedUsuariosIdFavourite = [...receta.usuarios_id_favourite, getStorageUser().usuarioId];
                            }

                            const updatedFavouriteInfo = favouriteInfo.map(item =>
                              item.idReceta === card._id ? { ...item, usuarios_id_favourite: updatedUsuariosIdFavourite } : item
                            );

                            setFavouriteInfo(updatedFavouriteInfo);

                          }
                          }
                          sx={{ transition: 'color 0.3s', padding: 0 }}
                        >
                          {idFavourites?.includes(card._id) ? <BookmarkIcon fontSize='large' sx={{ color: 'yellow' }} /> : <BookmarkBorderIcon fontSize='large' />}
                        </IconButton>
                        <p>{favouriteInfo?.find(value => value.idReceta === card._id).usuarios_id_favourite.length}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                          onClick={() => {

                            saveUpdateReactionReceta({ data: { idReceta: card?._id, idUser: getStorageUser().usuarioId, estado: !reactionInfo.find(value => value.idReceta === card?._id).usuarios_id_reaction.some(value => value === getStorageUser().usuarioId), type: TypeNotification.LikeToReceta } })
                            const receta = reactionInfo.find(value => value.idReceta === card?._id);

                            const userExists = receta.usuarios_id_reaction.some(value => value === getStorageUser().usuarioId);

                            let updatedUsuariosIdReaction;

                            if (userExists) {
                              updatedUsuariosIdReaction = receta.usuarios_id_reaction.filter(value => value !== getStorageUser().usuarioId);
                            } else {
                              updatedUsuariosIdReaction = [...receta.usuarios_id_reaction, getStorageUser().usuarioId];
                            }

                            const updatedReactionInfo = reactionInfo.map(item =>
                              item.idReceta === card?._id ? { ...item, usuarios_id_reaction: updatedUsuariosIdReaction } : item
                            );

                            setReactionInfo(updatedReactionInfo);
                          }

                          }
                        >
                          <FavoriteIcon
                            sx={{
                              color: reactionInfo?.find(value => value.idReceta === card?._id).usuarios_id_reaction.some(value => value == getStorageUser().usuarioId) ? 'red' : 'gray', transition: 'color 0.5s'
                            }}
                          />
                        </IconButton>
                        <span>{reactionInfo?.find(value => value.idReceta === card?._id).usuarios_id_reaction.length}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton onClick={() => {
                          setIdReceta(card?._id);
                          window.history.replaceState('', '', `/main/p/${card._id}`);
                          setOpenReceta(true);
                        }}>
                          <CommentIcon sx={{ color: 'blue', width: '34px' }} />
                        </IconButton>
                        <p>{card?.comments.length}</p>
                      </div>
                    </div>
                  </div>
                  <div style={{ position: 'absolute', left: 0, top: 0, display: 'flex', alignItems: 'center' }}>
                    <IconButton
                      aria-label="more"
                      aria-controls={anchorEl ? 'long-menu' : undefined}
                      aria-expanded={Boolean(anchorEl)}
                      aria-haspopup="true"
                      onClick={(event) => handleClickMore(event, card)}
                    >
                      <MoreVertIcon fontSize='large' sx={{ color: 'black' }} />
                    </IconButton>
                    <Menu
                      id="long-menu"
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl) && currentCard?._id === card._id}
                      onClose={handleCloseMore}
                      PaperProps={{
                        style: {
                          maxHeight: ITEM_HEIGHT * 4.5,
                          width: '20ch',
                        },
                      }}
                    >
                      <MenuItem onClick={(e) => {
                        setUpdateId(card._id)
                        setOpenUpdateForm(true)
                        handleCloseMore()
                      }}
                        sx={{ height: '50px' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          <div style={{ marginRight: '10px' }}>
                            <CachedIcon />
                          </div>
                          <h4>UPDATE</h4>
                        </div>
                      </MenuItem>
                      <MenuItem onClick={async (e) => {
                        // Primero, actualizamos el estado local
                        await handleCloseMore()

                        const updatedArray = misRecetas.map(
                          item => item._id === card._id ? { ...item, pined: !card.pined } : item
                        );
                        setMisRecetas(updatedArray);

                        // Luego, obtenemos el nuevo estado de "pined" para este elemento
                        const updatedCard = updatedArray.find(item => item._id === card._id);

                        // Llamamos a la función para actualizar la base de datos
                        await actualizarPined(card._id, updatedCard.pined);
                      }}
                        sx={{ height: '50px' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          <div style={{ marginRight: '10px' }}>
                            {card?.pined ? <PushPinIcon /> : <PushPinOutlinedIcon />}
                          </div>
                          {card?.pined ? <h4>UNPIN</h4> : <h4>PIN</h4>}
                        </div>

                      </MenuItem>
                      <MenuItem sx={{ color: 'red', height: '50px' }} onClick={() => { handleClickOpenConfirmation(); handleCloseMore() }}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          <div style={{ marginRight: '10px' }}>
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
                                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                              },
                            }
                          }}
                        >
                          <div style={{ padding: '16px 24px', fontFamily: 'sans-serif' }}>
                            <h3 style={{ fontWeight: 500 }}>Are you sure you want to delete the Recipe ? </h3>
                            <h1>{card.titulo}</h1>
                          </div>
                          <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                              Click on DELETE to delete this Recipe otherwise Click on CANCEL
                            </DialogContentText>
                          </DialogContent>
                          <DialogActions sx={{ gap: '25px' }}>
                            <Button variant='outlined' onClick={handleCloseConfirmation}>CANCEL</Button>
                            <Button sx={{ marginRight: '15px' }} variant='contained' color='error' onClick={async (e) => {
                              await desactivarReceta({ recetaId: card._id }); await getUserAndReceta({ data: { userId: getStorageUser().usuarioId, page, limit } }).then((res) => {
                                setReactionInfo(res.Recetas?.map(recipe => {
                                  return {
                                    idReceta: recipe._id,
                                    usuarios_id_reaction: recipe.reactions.map(reaction => reaction.user_id)
                                  };
                                }))

                                setFavouriteInfo(res.Recetas?.map(recipe => {
                                  return {
                                    idReceta: recipe._id,
                                    usuarios_id_favourite: recipe.favourite
                                  }
                                }))
                              }); handleCloseConfirmation();
                              console.log(idFavourites);
                              console.log(card._id);
                              console.log(idFavourites.includes(card._id));
                              console.log(idFavourites.filter(favourite => favourite != card._id))
                              if (idFavourites.includes(card._id)) {
                                setCantidadFavoritos(prevCantidad => prevCantidad - 1);
                              }
                            }}>
                              DELETE
                            </Button>
                          </DialogActions>
                        </Dialog>
                      </MenuItem>
                    </Menu>
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      zIndex: 1, // Para asegurar que el Fab esté sobre los demás elementos
                    }}
                  >
                    <Fab
                      aria-label="add"
                      onClick={() => { handleClickExpand(card?._id) }}
                      sx={{ height: '30px', width: '30px', minHeight: 'unset', color: 'black', boxShadow: 'unset', backgroundColor: 'white' }}
                    >
                      {isExpanded[card?._id] ? <RemoveCircleIcon /> : <AddIcon />}
                    </Fab>
                  </div>
                </Box>
                <Box
                  sx={{
                    width: '100%',
                    height: isExpanded[card._id] ? '100%' : '50%',
                    transition: 'ease-in-out 0.5s',
                    backgroundColor: 'white', // Fondo blanco
                    borderRadius: '0px 0px 8px 8px',
                    overflow: isExpanded[card._id] ? 'auto' : 'none', // Centra el contenido horizontalmente
                    scrollbarWidth: 'thin',
                    clipPath: 'border-box',
                    position: 'relative'
                  }}
                >
                  <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex', // Usar flexbox para centrar el contenido
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}>
                    <ul style={{ height: '100%', padding: '0px 0px 0px 10px', margin: 0, display: 'flex', flexDirection: 'column' }}>
                      <h3>{card?.titulo}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', height: '15px' }}>
                        <AccessTimeIcon />
                        <p>{card?.hours > 0 ? card?.hours + "h " + card?.minutes + "m" : card?.minutes + "M"}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <PersonIcon />
                          <p>{card?.cantidadPersonas}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <AssignmentIcon />
                          <p>{card?.dificultad[0].nombreDificultad}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <RestaurantIcon />
                          <p>{card?.categoria[0].nombreCategoria}</p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', width: '100%'}}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginBottom: '10px',
                          flexWrap: 'wrap'
                        }}>
                          {
                            card?.subCategoria.map((value) =>
                              IconSvg(value.nombreSubCategoria)
                            )
                          }
                        </div>
                      </div>

                      <p>{dateConvert(card?.fechaReceta)}</p>
                      <p>{card?.descripcion}</p>

                      <h3>INGREDIENTS</h3>
                      {
                        card?.grupoIngrediente?.map((value) => (
                          <div key={value.nombreGrupo}>
                            <h4>{value.nombreGrupo}</h4>
                            {value.item.map((value2, index) => (
                              <p>{`${value2.valor} ${value2.medida.nombreMedida == 'Quantity' ? '' : value2.medida.nombreMedida} ${value2.ingrediente.nombreIngrediente}`}</p>
                            ))}
                          </div>
                        ))
                      }
                    </ul>
                  </div>
                </Box>
              </Box>
            </Zoom>
          ))
        }
        {
          misRecetas?.length == 0 ? <h4>Not Recetas Founded</h4> : misRecetas.length > 6 ? <div id="visor" ref={externalRef}></div> : <></>
        }
      </Box >
      {
        openForm
          ? <RecetaForm setCantidadReceta={setCantidadReceta} open={openForm} getUserAndReceta={getUserAndReceta} setOpen={setOpenForm} setReactionInfo={setReactionInfo} setFavouriteInfo={setFavouriteInfo} page={page} limit={limit} />
          : <></>
      }
      {
        openUpdateForm
          ? <UpdateRecetaForm setCantidadReceta={setCantidadReceta} open={openUpdateForm} getUserAndReceta={getUserAndReceta} setOpen={setOpenUpdateForm} recetaId={UpdateId} page={page} limit={limit} setReactionInfo={setReactionInfo} setFavouriteInfo={setFavouriteInfo} />
          : <></>
      }
      {
        openReceta
          ?
          <Modal
            open={openReceta}
            closeAfterTransition
            BackdropProps={{
              timeout: 500,
            }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>

            <DetailsReceta isFull={false} isFromProfile={true} idReceta={idReceta} setOpen={setOpenReceta} idUser={getStorageUser().usuarioId} username={getStorageUser().username} />
          </Modal>
          : <></>
      }


    </Box >

  );
};
