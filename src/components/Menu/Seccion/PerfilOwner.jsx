import AddIcon from '@mui/icons-material/Add';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import CachedIcon from '@mui/icons-material/Cached';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PushPinIcon from '@mui/icons-material/PushPin';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, Fab, IconButton, ImageListItem, Modal, Zoom } from "@mui/material";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useEffect, useState } from "react";
import { useReceta } from "../../../Hooks/useReceta";
import { useUsuario } from '../../../Hooks/useUsuario';
import { getStorageUser } from "../../../utils/StorageUser";
import { DetailsReceta } from './DitailsReceta';
import { RecetaForm } from "./RecetaForm";
import { UpdateRecetaForm } from './UpdateRecetaForm';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

export const PerfilOwner = ({ setCantidadFavoritos, setCantidadReceta }) => {

  const [openConfirmation, setOpenConfirmation] = useState(false);

  const handleClickOpenConfirmation = () => {
    setOpenConfirmation(true);
  };

  const handleCloseConfirmation = () => {
    setOpenConfirmation(false);
  };

  const dateConvert = (date) => {
    const dateObject = new Date(date);

    const day = String(dateObject.getDate()).padStart(2, '0');
    const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = dateObject.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;

    return formattedDate
  }

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
  const { getUserAndReceta, misRecetas, setMisRecetas, actualizarPined, desactivarReceta } = useReceta({ setCantidadReceta: setCantidadReceta });
  const { ObtenerIdFavourites, idFavourites, setIdFavourites, SaveUpdateMyFavourites } = useUsuario({ setCantidadFavoritos: setCantidadFavoritos });
  const [openReceta, setOpenReceta] = useState(false)
  const [idReceta, setIdReceta] = useState(null);
  const [UpdateId, setUpdateId] = useState(null);
  const [currentCard, setCurrentCard] = useState(null);
  const [isExpanded, setIsExpanded] = useState({});

  const ITEM_HEIGHT = 48;

  useEffect(() => {
    getUserAndReceta({ userId: getStorageUser().usuarioId })
    ObtenerIdFavourites({ idUser: getStorageUser().usuarioId })
  }, [])

  const handleBookmarkClick = async (id, action) => {

    var result = [];
    await SaveUpdateMyFavourites({ body: { idUser: getStorageUser().usuarioId, idReceta: id, estado: action } }).then((res) => {
      setCantidadFavoritos(res.cantidadFavourite);

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
          width: '80px',
          height: '80px'
        }}
        onClick={() => { setOpenForm(true) }}
      >
        <AddIcon />
      </Fab>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: '15px' }}>
        {misRecetas?.sort((a, b) => {
          if (a.pined !== b.pined) {
            return b.pined - a.pined;
          }
          return new Date(b.fechaReceta) - new Date(a.fechaReceta);
        })
          .map((card, index) => (
            <Zoom key={card._id} in={true} timeout={300 + (index * 80)}>
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
                  <img
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover', // Ajusta la imagen para que cubra el espacio sin deformarse
                      borderRadius: '8px 8px 0px 0px', // Añade bordes redondeados a la imagen
                    }}
                    srcSet={card ? card.images[0] : null}
                    src={card ? card.images[0] : null}
                    alt="Imagen"
                    loading="lazy"
                  />
                  {card?.pined ? <div style={{ position: 'absolute', right: 0, top: -10, display: 'flex', alignItems: 'center', rotate: '20px' }}>
                    <PushPinIcon sx={{ fontSize: '25px' }} />
                  </div> : <></>}

                  <div style={{ position: 'absolute', right: 20, top: 0, display: 'flex', alignItems: 'center' }}>
                    <IconButton
                      onClick={() => handleBookmarkClick(card._id, !idFavourites.includes(card._id))}
                      sx={{ transition: 'color 0.3s' }}
                    >
                      {idFavourites.includes(card._id) ? <BookmarkIcon fontSize='large' sx={{ color: 'yellow' }} /> : <BookmarkBorderIcon fontSize='large' />}
                    </IconButton>
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
                              await desactivarReceta({ recetaId: card._id }); await getUserAndReceta({ userId: getStorageUser().usuarioId }); handleCloseConfirmation();
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
                    overflow: 'auto', // Centra el contenido horizontalmente
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

                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {
                          card?.subCategoria.map((value) =>
                            <p>{value.nombreSubCategoria}</p>
                          )
                        }
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

                {/* <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button onClick={(e) => {
                    e.preventDefault();
                    setIdReceta(card?._id);
                    window.history.replaceState('', '', `/main/p/${card._id}`);
                    setOpenReceta(true);
                  }}>open me</Button>
                  <Button onClick={() => {
                    setUpdateId(card._id)
                    setOpenUpdateForm(true)
                  }}>Update</Button>
                  <Button onClick={handleClickOpenConfirmation}>
                    Eliminar
                  </Button>
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
                        await desactivarReceta({ recetaId: card._id }); await getUserAndReceta({ userId: getStorageUser().usuarioId }); handleCloseConfirmation();
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
                  {
                    idFavourites?.includes(card._id)
                      ? <IconButton
                        onClick={() => handleBookmarkClick(card._id, false)}
                        sx={{ transition: 'color 0.3s' }}
                      >
                        <BookmarkIcon sx={{ color: 'yellow' }} />

                      </IconButton>
                      : <IconButton
                        onClick={() => handleBookmarkClick(card._id, true)}
                        sx={{ transition: 'color 0.3s' }}
                      >
                        <BookmarkBorderIcon />
                      </IconButton>
                  }
                  <IconButton onClick={async (e) => {
                    // Primero, actualizamos el estado local
                    const updatedArray = misRecetas.map(
                      item => item._id === card._id ? { ...item, pined: !card.pined } : item
                    );
                    setMisRecetas(updatedArray);

                    // Luego, obtenemos el nuevo estado de "pined" para este elemento
                    const updatedCard = updatedArray.find(item => item._id === card._id);

                    // Llamamos a la función para actualizar la base de datos
                    await actualizarPined(card._id, updatedCard.pined);
                  }}>
                    {
                      card?.pined ? <PushPinIcon /> : <PushPinOutlinedIcon />
                    }
                  </IconButton>

                </div>
                <img src={card?.image} alt={card.title} width="100%" />

                <h2>{card.titulo}</h2>
                <p>{card.descripcion}</p>
                <p>{card._id}</p> */}
              </Box>
            </Zoom>
          ))
        }
        {
          misRecetas?.length == 0 ? <h4>Not Recetas Founded</h4> : <></>
        }
      </Box >
      {
        openForm
          ? <RecetaForm setCantidadReceta={setCantidadReceta} open={openForm} getUserAndReceta={getUserAndReceta} setOpen={setOpenForm} />
          : <></>
      }
      {
        openUpdateForm
          ? <UpdateRecetaForm setCantidadReceta={setCantidadReceta} open={openUpdateForm} getUserAndReceta={getUserAndReceta} setOpen={setOpenUpdateForm} recetaId={UpdateId} />
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

            <DetailsReceta isFull={false} isFromProfile={true} idReceta={idReceta} setOpen={setOpenReceta} idUser={getStorageUser().usuarioId} />
          </Modal>
          : <></>
      }
    </Box >

  );
};
