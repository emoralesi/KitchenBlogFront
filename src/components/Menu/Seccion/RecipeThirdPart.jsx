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

export const RecipeThirdPart = ({
  detailsReceta,
  reactions,
  setReactions,
  recetaReactions,
  setRecetaReactions,
  idReceta,
  getDetailsReceta,
  saveUpdateReactionReceta,
}) => {
  const [visibleComments, setVisibleComments] = useState(3);
  const [visibleAnswers, setVisibleAnswers] = useState({});
  const [commentParent, setCommentParent] = useState("");
  const [responseContent, setResponseContent] = useState({});
  const { SaveUpdateCommentReaction, guardarComment } = useComment();

  const handleShowMoreComments = () => {
    setVisibleComments((prev) => prev + 3);
  };

  const handleShowMoreAnswers = (index) => {
    setVisibleAnswers((prev) => ({
      ...prev,
      [index]: (prev[index] || 3) + 3,
    }));
  };

  const handleResponseContentChange = (index, value) => {
    setResponseContent((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

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

  const handleSendResponse = async (index, commentId, parentComment, type) => {
    const id = await guardarComment({
      comentario: {
        content: responseContent[index],
        user: getStorageUser().usuarioId,
        parentComment,
        receta: idReceta,
        type,
      },
    });

    setReactions((prev) => ({
      ...prev,
      [id]: { estado: false, count: 0 },
    }));

    await getDetailsReceta({ recetaId: idReceta });
    setResponseContent((prev) => ({
      ...prev,
      [index]: "",
    }));
  };

  const handleRecetaLike = () => {
    const liked = recetaReactions?.some(
      (v) => v.user_id === getStorageUser().usuarioId
    );

    if (liked) {
      setRecetaReactions(
        recetaReactions.filter((r) => r.user_id !== getStorageUser().usuarioId)
      );
    } else {
      setRecetaReactions([
        ...recetaReactions,
        { user_id: getStorageUser().usuarioId },
      ]);
    }

    saveUpdateReactionReceta({
      data: {
        idReceta,
        idUser: getStorageUser().usuarioId,
        estado: !liked,
        type: TypeNotification.LikeToReceta,
      },
    });
  };

  return (
    <Grid container spacing={4}>
      {/* PASOS */}
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
                .sort((a, b) => a.pasoNumero - b.pasoNumero)
                .map((value, idx) => (
                  <Box key={idx}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Paso {value.pasoNumero}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body1" color="text.secondary">
                      {value.descripcion}
                    </Typography>
                  </Box>
                ))}
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Grid>

      {/* COMENTARIOS */}
      <Grid item xs={12} md={6}>
        <Box sx={{ px: 2 }}>
          {/* Header + Like receta */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6" fontWeight={600}>
              Comentarios
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <IconButton onClick={handleRecetaLike}>
                <FavoriteIcon
                  sx={{
                    color: recetaReactions?.some(
                      (v) => v.user_id === getStorageUser().usuarioId
                    )
                      ? "red"
                      : "gray",
                    transition: "color 0.3s",
                  }}
                />
              </IconButton>
              <Typography variant="body2">
                {recetaReactions?.length || 0}
              </Typography>
            </Box>
          </Box>

          <Stack direction="row" spacing={2} mb={3}>
            <TextField
              fullWidth
              size="small"
              label="Escribe un comentario..."
              value={commentParent}
              onChange={(e) => setCommentParent(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={async () => {
                const id = await guardarComment({
                  comentario: {
                    content: commentParent,
                    user: getStorageUser().usuarioId,
                    receta: idReceta,
                    type: TypeNotification.CommentToReceta,
                  },
                });
                setReactions((prev) => ({
                  ...prev,
                  [id]: { estado: false, count: 0 },
                }));
                await getDetailsReceta({ recetaId: idReceta });
                setCommentParent("");
              }}
            >
              Enviar
            </Button>
          </Stack>

          {/* Lista de comentarios */}
          <Stack spacing={3}>
            {detailsReceta.comments
              ?.slice()
              .sort((a, b) => new Date(b.dateComment) - new Date(a.dateComment))
              .filter((c) => c._id)
              .slice(0, visibleComments)
              .map((comment, index) => (
                <Paper key={comment._id} sx={{ p: 2 }}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar
                        sx={{ bgcolor: "primary.main" }}
                        src={comment.user.profileImageUrl}
                      >
                        {comment.user.username.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography fontWeight={600}>
                        {comment.user.username}
                      </Typography>
                    </Stack>
                    <Box display="flex" alignItems="center" gap={1}>
                      <IconButton
                        onClick={() =>
                          handleReaction(
                            comment._id,
                            !reactions[comment._id]?.estado,
                            TypeNotification.LikeToComment,
                            null
                          )
                        }
                      >
                        <FavoriteIcon
                          sx={{
                            color: reactions[comment._id]?.estado
                              ? "red"
                              : "gray",
                          }}
                        />
                      </IconButton>
                      <Typography variant="body2">
                        {reactions[comment._id]?.count || 0}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {comment.content}
                  </Typography>

                  {/* Respuestas */}
                  <Stack spacing={1} mt={2} pl={2}>
                    {comment.responses
                      .slice()
                      .sort(
                        (a, b) =>
                          new Date(a.dateComment) - new Date(b.dateComment)
                      )
                      .filter((r) => r._id)
                      .slice(0, visibleAnswers[index] || 3)
                      .map((answer, i) => (
                        <Box key={i}>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              <Avatar
                                sx={{ bgcolor: "primary.main" }}
                                src={answer.user.profileImageUrl}
                              >
                                {answer.user.username.charAt(0).toUpperCase()}
                              </Avatar>
                              <Typography fontWeight={500}>
                                {answer.user.username}
                              </Typography>
                            </Stack>
                            <Box display="flex" alignItems="center" gap={1}>
                              <IconButton
                                onClick={() =>
                                  handleReaction(
                                    answer._id,
                                    !reactions[answer._id]?.estado,
                                    TypeNotification.LikeToAnswerd,
                                    answer.parentComment
                                  )
                                }
                              >
                                <FavoriteIcon
                                  sx={{
                                    color: reactions[answer._id]?.estado
                                      ? "red"
                                      : "gray",
                                  }}
                                />
                              </IconButton>
                              <Typography variant="body2">
                                {reactions[answer._id]?.count || 0}
                              </Typography>
                            </Box>
                          </Box>
                          <Typography variant="body2" sx={{ ml: 7 }}>
                            {answer.content}
                          </Typography>
                        </Box>
                      ))}

                    {comment.responses.filter((r) => r._id).length >
                      (visibleAnswers[index] || 3) && (
                      <Button
                        size="small"
                        onClick={() => handleShowMoreAnswers(index)}
                      >
                        Ver más respuestas
                      </Button>
                    )}

                    {/* Input para responder */}
                    <Stack direction="row" spacing={1} mt={1}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Responder..."
                        value={responseContent[index] || ""}
                        onChange={(e) =>
                          handleResponseContentChange(index, e.target.value)
                        }
                      />
                      <Button
                        variant="outlined"
                        onClick={() =>
                          handleSendResponse(
                            index,
                            comment.id,
                            comment._id,
                            TypeNotification.CommentToAnswerd
                          )
                        }
                      >
                        Responder
                      </Button>
                    </Stack>
                  </Stack>
                </Paper>
              ))}

            {detailsReceta.comments?.filter((c) => c._id).length >
              visibleComments && (
              <Button onClick={handleShowMoreComments}>
                Ver más comentarios
              </Button>
            )}

            {detailsReceta.comments?.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                No hay comentarios aún.
              </Typography>
            )}
          </Stack>
        </Box>
      </Grid>
    </Grid>
  );
};

export default RecipeThirdPart;
