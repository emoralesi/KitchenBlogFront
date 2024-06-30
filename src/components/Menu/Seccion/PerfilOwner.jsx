import AddIcon from '@mui/icons-material/Add';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { Box, Button, Fab, IconButton, Modal, Zoom } from "@mui/material";
import { useEffect, useState } from "react";
import { useReceta } from "../../../Hooks/useReceta";
import { useUsuario } from '../../../Hooks/useUsuario';
import { getStorageUser } from "../../../utils/StorageUser";
import { DetailsReceta } from './DitailsReceta';
import { RecetaForm } from "./RecetaForm";

export const PerfilOwner = () => {

  const [openForm, setOpenForm] = useState(false);
  const { getUserAndReceta, misRecetas } = useReceta();
  const { ObtenerIdFavourites, idFavourites, setIdFavourites, SaveUpdateMyFavourites } = useUsuario();
  const [openReceta, setOpenReceta] = useState(false)
  const [idReceta, setIdReceta] = useState(null);

  useEffect(() => {
    getUserAndReceta({ userId: getStorageUser().usuarioId })
    ObtenerIdFavourites({ idUser: getStorageUser().usuarioId })
  }, [])

  const handleBookmarkClick = async (id, action) => {

    var result = [];
    await SaveUpdateMyFavourites({ body: { idUser: getStorageUser().usuarioId, idReceta: id, estado: action } })
    action ? result = [...idFavourites, id] : result = idFavourites.filter(favourite => favourite != id)

    console.log("asi me quedo el idFacourite", result);
    setIdFavourites(result);
  };

  return (
    <Box>
      <Box>
        {
          console.log("mis recetas", misRecetas)
        }
        <Fab onClick={() => { setOpenForm(true) }} color="success" variant="extended" sx={{ width: '100%' }} aria-label="add">
          <AddIcon />
        </Fab>
      </Box>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: '15px' }}>
        {misRecetas?.map((card, index) => (
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
              </div>
              <img src={card?.image} alt={card.title} width="100%" />

              <h2>{card.titulo}</h2>
              <p>{card.descripcion}</p>
              <p>{card._id}</p>
            </Box>
          </Zoom>
        ))}
        {
          misRecetas.length == 0 ? <h4>Not Recetas Founded</h4> : <></>
        }
      </Box>
      {
        open
          ? <RecetaForm open={openForm} getUserAndReceta={getUserAndReceta} setOpen={setOpenForm} />
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
    </Box>

  );
};
