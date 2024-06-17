import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Fab, Modal, Zoom } from "@mui/material";
import { useEffect, useState } from "react";
import { usePost } from "../../../Hooks/usePost";
import { getStorageUser } from "../../../utils/StorageUser";
import { DetailsPost } from './DitailsPost';
import { PostForm } from "./PostForm";

export const PerfilOwner = () => {

  const [openForm, setOpenForm] = useState(false);
  const { getUserAndPost, misPosts } = usePost();
  const [openPost, setOpenPost] = useState(false)
  const [idPost, setIdPost] = useState(null);

  useEffect(() => {
    getUserAndPost({ userId: getStorageUser().usuarioId })
  }, [])

  return (
    <Box>
      <Box>
        <Fab onClick={() => { setOpenForm(true) }} color="success" variant="extended" sx={{ width: '100%' }} aria-label="add">
          <AddIcon />
        </Fab>
      </Box>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: '15px' }}>
        {misPosts?.map((card, index) => (
          <Zoom key={card.title} in={true} timeout={300 + (index * 80)}>
            <Box
              key={card.title}
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
              <img src={card?.image} alt={card.title} width="100%" />
              <Button onClick={(e) => {
                e.preventDefault();
                setIdPost(card?._id);
                window.history.replaceState('', '', `/main/p/${card._id}`);
                setOpenPost(true);
              }}>open me</Button>
              <h2>{card.title}</h2>
              <p>{card.content}</p>
              <p>{card._id}</p>
            </Box>
          </Zoom>
        ))}
      </Box>
      {
        open
          ? <PostForm open={openForm} getUserAndPost={getUserAndPost} setOpen={setOpenForm} />
          : <></>
      }
      {
        openPost
          ?
          <Modal
            open={openPost}
            closeAfterTransition
            BackdropProps={{
              timeout: 500,
            }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>

            <DetailsPost isFull={false} idPost={idPost} setOpen={setOpenPost} idUser={getStorageUser().usuarioId} />
          </Modal>
          : <></>
      }
    </Box>

  );
};
