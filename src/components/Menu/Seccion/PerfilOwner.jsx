import AddIcon from '@mui/icons-material/Add';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PushPinIcon from '@mui/icons-material/PushPin';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab, IconButton, Modal, Zoom } from "@mui/material";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useEffect, useState } from "react";
import { useReceta } from "../../../Hooks/useReceta";
import { useUsuario } from '../../../Hooks/useUsuario';
import { getStorageUser } from "../../../utils/StorageUser";
import { DetailsReceta } from './DitailsReceta';
import { RecetaForm } from "./RecetaForm";
import { UpdateRecetaForm } from './UpdateRecetaForm';

export const PerfilOwner = ({ setCantidadFavoritos, setCantidadReceta }) => {

  const [openConfirmation, setOpenConfirmation] = useState(false);

  const handleClickOpenConfirmation = () => {
    setOpenConfirmation(true);
  };

  const handleCloseConfirmation = () => {
    setOpenConfirmation(false);
  };

  const [openForm, setOpenForm] = useState(false);
  const [openUpdateForm, setOpenUpdateForm] = useState(false);
  const { getUserAndReceta, misRecetas, setMisRecetas, actualizarPined, desactivarReceta } = useReceta({ setCantidadReceta: setCantidadReceta });
  const { ObtenerIdFavourites, idFavourites, setIdFavourites, SaveUpdateMyFavourites } = useUsuario({ setCantidadFavoritos: setCantidadFavoritos });
  const [openReceta, setOpenReceta] = useState(false)
  const [idReceta, setIdReceta] = useState(null);
  const [UpdateId, setUpdateId] = useState(null);

  useEffect(() => {
    getUserAndReceta({ userId: getStorageUser().usuarioId })
    ObtenerIdFavourites({ idUser: getStorageUser().usuarioId })
  }, [])

  const handleBookmarkClick = async (id, action) => {

    var result = [];
    await SaveUpdateMyFavourites({ body: { idUser: getStorageUser().usuarioId, idReceta: id, estado: action } })
    action ? result = [...idFavourites, id] : result = idFavourites.filter(favourite => favourite != id)
    setIdFavourites(result);
  };

  return (
    <Box>
      <Box>
        {
          console.log("mis recetas", misRecetas)
        }
        <Fab onClick={() => { setOpenForm(true) }} color="success" variant="extended" sx={{ width: '100%', marginBottom: '10px' }} aria-label="add">
          <AddIcon />
        </Fab>
      </Box>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: '15px' }}>
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
                  p: 2,
                  border: 1,
                  borderRadius: 2,
                  minWidth: "220px", // Minimum width
                  maxWidth: "500px", // Maximum width
                  minHeight: "280px", // Minimum height
                  maxHeight: "620px", // Maximum height
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
                    {/* <DialogTitle id="alert-dialog-title">
                      <p>Are you sure you want to delete the Recipe : </p>
                      <h2>{card.titulo}</h2>
                    </DialogTitle> */}
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
                <p>{card._id}</p>
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
