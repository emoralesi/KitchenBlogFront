import { Box, Button, Fab, Zoom } from "@mui/material";
import { useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import { PostForm } from "./PostForm";
import { usePost } from "../../../Hooks/usePost";
import { getStorageUser } from "../../../utils/StorageUser";
import { DitailsPost } from "./DitailsPost";

export const MiPerfil = () => {
  const [data, setData] = useState([
    { title: "Card 1", image: "image1.jpg", content: "Content for card 1" },
    { title: "Card 2", image: "image2.jpg", content: "Content for card 2" },
    { title: "Card 3", image: "image3.jpg", content: "Content for card 3" },
    { title: "Card 4", image: "image4.jpg", content: "Content for card 4" },
    { title: "Card 5", image: "image5.jpg", content: "Content for card 5" },
    { title: "Card 6", image: "image6.jpg", content: "Content for card 6" },
  ]);

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
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}>
        {misPosts?.map((card, index) => (
          <Zoom key={card.title} in={true} timeout={300 + (index * 80)}>
            <Box
              key={card.title}
              sx={{
                p: 2,
                border: 1,
                margin: '5px',
                borderRadius: 2,
                minWidth: "220px", // Minimum width
                maxWidth: "500px", // Maximum width
                minHeight: "280px", // Minimum height
                maxHeight: "620px", // Maximum height
              }}
            >
              <img src={card?.image} alt={card.title} width="100%" />
              <Button onClick={() => {
                setOpenPost(true);
                setIdPost(card?._id);
              }}>open me</Button>
              <h2>{card.title}</h2>
              <p>{card.content}</p>
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
          ? <DitailsPost open={openPost} setOpen={setOpenPost} />
          : <></>
      }
    </Box>

  );
};
