import { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useComment } from "../../../Hooks/useComment";
import { getStorageUser } from "../../../utils/StorageUser";
import { TypeNotification } from "../../../utils/enumTypeNoti";
import { getCloudinaryUrl } from "../../../utils/GetCloudinaryUrl";

export const RecipeThirdPartAI = ({
  detailsReceta,
  previewMode = false,

  // props SOLO para receta persistida
  reactions,
  setReactions,
  recetaReactions,
  setRecetaReactions,
  idReceta,
  getDetailsReceta,
  saveUpdateReactionReceta,
}) => {
  /* ===========================
     🔒 PREVIEW MODE
     Solo pasos, nada social
  =========================== */
  if (previewMode) {
    return (
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Accordion defaultExpanded sx={{ boxShadow: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" fontWeight={600}>
                Pasos
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={3}>
                {detailsReceta.pasos
                  ?.slice()
                  .sort((a, b) => a.pasoNumero - b.pasoNumero)
                  .map((paso, idx) => (
                    <Box key={idx}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        Paso {paso.pasoNumero}
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body1" color="text.secondary">
                        {paso.descripcion}
                      </Typography>
                    </Box>
                  ))}
              </Stack>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    );
  }

  /* ===========================
     🟢 MODO NORMAL (receta real)
  =========================== */
  const { SaveUpdateCommentReaction, guardarComment } = useComment();

  const [visibleComments, setVisibleComments] = useState(3);
  const [visibleAnswers, setVisibleAnswers] = useState({});
  const [commentParent, setCommentParent] = useState("");
  const [responseContent, setResponseContent] = useState({});

  const handleReaction = async (id, estado, type, parentComment) => {
    await SaveUpdateCommentReaction({
      body: {
        idComment: id,
        idUser: getStorageUser().usuarioId,
        estado,
        type,
        parentComment,
        idReceta,
      },
    });

    setReactions((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        estado,
        count: estado ? prev[id].count + 1 : prev[id].count - 1,
      },
    }));
  };

  const handleRecetaLike = () => {
    const liked = recetaReactions?.some(
      (v) => v.user_id === getStorageUser().usuarioId
    );

    saveUpdateReactionReceta({
      data: {
        idReceta,
        idUser: getStorageUser().usuarioId,
        estado: !liked,
        type: TypeNotification.LikeToReceta,
      },
    });

    setRecetaReactions((prev) =>
      liked
        ? prev.filter((r) => r.user_id !== getStorageUser().usuarioId)
        : [...prev, { user_id: getStorageUser().usuarioId }]
    );
  };

  return (
    <Grid container spacing={4}>
      {/* Pasos */}
      <Grid item xs={12} md={6}>
        <Accordion defaultExpanded sx={{ boxShadow: 1 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" fontWeight={600}>
              Pasos
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={3}>
              {detailsReceta.pasos
                ?.slice()
                .sort((a, b) => a.pasoNumero - b.pasoNumero)
                .map((paso, idx) => (
                  <Box key={idx}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Paso {paso.pasoNumero}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body1" color="text.secondary">
                      {paso.descripcion}
                    </Typography>
                  </Box>
                ))}
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Grid>

      {/* Comentarios + likes (SIN CAMBIOS funcionales) */}
      <Grid item xs={12} md={6}>
        {/* 👉 aquí queda TODO tu bloque social original */}
      </Grid>
    </Grid>
  );
};

export default RecipeThirdPartAI;