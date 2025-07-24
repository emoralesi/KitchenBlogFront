import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  CircularProgress,
  IconButton,
  Typography,
  Zoom,
} from "@mui/material";
import { useEffect, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useComment } from "../../../Hooks/useComment";
import { useReceta } from "../../../Hooks/useReceta";
import { getStorageUser } from "../../../utils/StorageUser";
import { RecetaNotFound } from "./RecetaNotFound";
import RecipeFirstPart from "../ShoppingList/RecipeFirstPart";
import RecipeThirdPart from "../ShoppingList/RecipeThirdPart";

export const DetailsReceta = ({
  isFull,
  setOpen,
  idReceta,
  idUser,
  isFromProfile,
  origen,
  username,
}) => {
  const { detailsReceta, getDetailsReceta, saveUpdateReactionReceta } =
    useReceta();

  const [reactions, setReactions] = useState({});
  const [recetaReactions, setRecetaReactions] = useState([]);
  const [recipeExists, setRecipeExists] = useState(true);
  const [loading, setLoading] = useState(true);

  const handleClose = () => {
    setOpen(false);
    isFromProfile
      ? window.history.replaceState("", "", `/main/profile/${username}`)
      : window.history.replaceState("", "", `/main/${origen}`);
  };

  useEffect(() => {
    const fetchDetailsReceta = async () => {
      try {
        const receta = await getDetailsReceta({ recetaId: idReceta });

        if (!receta) {
          setRecipeExists(false);
        } else {
          const initialReactions = {};
          receta.comments.forEach((comment) => {
            initialReactions[comment._id] = {
              estado: comment.reactions.some(
                (value) => value.user_id === getStorageUser().usuarioId
              ),
              count: comment.reactions.filter((value) => value._id).length,
            };
            comment.responses.forEach((response) => {
              initialReactions[response._id] = {
                estado: response.reactions.some(
                  (value) => value.user_id === getStorageUser().usuarioId
                ),
                count: response.reactions.filter((value) => value._id).length,
              };
            });
          });
          setRecetaReactions(receta.reactions);
          setReactions(initialReactions);
          setRecipeExists(true);
        }
      } catch (error) {
        console.error("Error fetching data", error);
        setRecipeExists(false);
      } finally {
        setLoading(false);
      }
    };

    fetchDetailsReceta();
  }, [idReceta]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!recipeExists) {
    return <RecetaNotFound />;
  }

  return isFull ? (
    <>{Receta()}</>
  ) : (
    <Zoom timeout={500} in={true}>
      {Receta()}
    </Zoom>
  );

  function Receta() {
    return (
      <Box
        sx={{
          width: isFull ? "auto" : { xs: "90vw", md: "85vw", lg: "80vw" },
          height: isFull
            ? "calc(100% - 4px)"
            : { xs: "85vh", md: "85vh", lg: "90vh" },
          bgcolor: "background.paper",
          border: "1px solid #e0e0e0",
          borderRadius: 4,
          boxShadow: 5,
          p: isFull ? 0 : { xs: 3, md: 4 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          fontFamily: "Roboto, sans-serif",
        }}
      >
        {!isFull && (
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              color: "grey.600",
            }}
          >
            <CloseIcon />
          </IconButton>
        )}

        {detailsReceta == null ? (
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ textAlign: "center", px: 2 }}
          >
            Lo sentimos, no pudimos encontrar la receta.
          </Typography>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              flexDirection: "column",
              height: "100%",
              width: "100%",
              overflowY: "auto",
              px: { xs: 2, md: 3 },
              py: 2,
              gap: 3,
            }}
          >
            <RecipeFirstPart detailsReceta={detailsReceta} />
            {/* <RecipeSecondPart data={detailsReceta} /> */}
            <RecipeThirdPart
              detailsReceta={detailsReceta}
              reactions={reactions}
              setReactions={setReactions}
              recetaReactions={recetaReactions}
              setRecetaReactions={setRecetaReactions}
              idReceta={idReceta}
              getDetailsReceta={getDetailsReceta}
              saveUpdateReactionReceta={saveUpdateReactionReceta}
            />
          </Box>
        )}
      </Box>
    );
  }
};
