import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Grid, IconButton, Paper, TextField, Typography } from "@mui/material";
import { useState } from 'react';
import { useComment } from '../../../Hooks/useComment';
import { useReceta } from '../../../Hooks/useReceta';
import { getStorageUser } from '../../../utils/StorageUser';
import { TypeNotification } from '../../../utils/enumTypeNoti';

export const RecipeThirdPart = ({
    detailsReceta,
    reactions,
    setReactions,
    recetaReactions,
    setRecetaReactions,
    idReceta
}) => {

    const [visibleComments, setVisibleComments] = useState(3);
    const [visibleAnswers, setVisibleAnswers] = useState({});
    const [commentParent, setCommentParent] = useState('');
    const [responseContent, setResponseContent] = useState({});
    const { getDetailsReceta, saveUpdateReactionReceta } = useReceta();
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
        console.log("mi tipo", type);
        await SaveUpdateCommentReaction({ body: { idComment: id, idUser: getStorageUser().usuarioId, estado: estado, type: type, parentComment: parentComment, idReceta: idReceta } });

        setReactions((prevReactions) => ({
            ...prevReactions,
            [id]: {
                ...prevReactions[id],
                estado: estado,
                count: estado ? prevReactions[id].count + 1 : prevReactions[id].count - 1
            },
        }));
    };

    const handleSendResponse = async (index, commentId, parentComment, type) => {
        console.log("mi comentario y/o respuesta", responseContent[index]);

        const id = await guardarComment({
            comentario: {
                content: responseContent[index],
                user: getStorageUser().usuarioId,
                parentComment: parentComment,
                receta: idReceta,
                type: type
            }
        });
        setReactions((prevReactions) => ({
            ...prevReactions,
            [id]: {
                ...prevReactions[id],
                estado: false,
                count: 0
            },
        }));
        await getDetailsReceta({ recetaId: idReceta });
        setResponseContent((prev) => ({
            ...prev,
            [index]: '',
        }));
    };



    return (
        <Grid container sx={{ width: '100%' }}>
            <Grid item xs={12} sm={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column', width: '100%', marginBottom: '20px' }}>
                <Accordion defaultExpanded sx={{ width: '100%', padding: 0, boxShadow: 'unset' }} >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{ width: '100%', padding: 0 }}
                    >
                        <h1>Pasos</h1>
                    </AccordionSummary>
                    <AccordionDetails sx={{ width: '100%', padding: 0 }}>
                        {detailsReceta.pasos
                            .sort((a, b) => a.pasoNumero - b.pasoNumero)
                            .map((value) => (
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'start' }}>

                                        <h3>Step : {value.pasoNumero}</h3>
                                    </div>
                                    <hr />
                                    <div style={{ display: 'flex', justifyContent: 'start' }}>

                                        <p>{value.descripcion}</p>
                                    </div>
                                </div>
                            ))}
                    </AccordionDetails>
                </Accordion>
            </Grid>
            <Grid item xs={12} sm={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column', width: '100%', marginBottom: '20px' }}>
                <Box height="100%" sx={{ flex: '1 1 50%', paddingLeft: '16px', height: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="h6" gutterBottom>
                            Comments
                        </Typography>
                        <div style={{ marginRight: '20px' }}>
                            <IconButton
                                onClick={() => {
                                    console.log("my log", recetaReactions?.some(value => value.user_id === getStorageUser().usuarioId))
                                    recetaReactions?.some(value => value.user_id === getStorageUser().usuarioId)
                                        ? setRecetaReactions(recetaReactions.filter(reaction => reaction.user_id != getStorageUser().usuarioId))
                                        : setRecetaReactions([...recetaReactions, { user_id: getStorageUser().usuarioId }])

                                    saveUpdateReactionReceta({ data: { idReceta: idReceta, idUser: getStorageUser().usuarioId, estado: !recetaReactions?.some(value => value.user_id === getStorageUser().usuarioId), type: TypeNotification.LikeToReceta } })
                                }}
                            >
                                <FavoriteIcon
                                    sx={{
                                        color: recetaReactions?.some(value => value.user_id === getStorageUser().usuarioId) ? 'red' : 'gray', transition: 'color 0.5s'
                                    }}
                                />
                            </IconButton>
                            <span>{recetaReactions?.length}</span>
                        </div>
                    </div>
                    <div style={{ paddingTop: '25px', paddingBottom: '25px' }}>
                        <TextField
                            type='text'
                            sx={{ paddingRight: '10%' }}
                            value={commentParent}
                            onChange={(e) => {
                                setCommentParent(e.target.value);
                            }}
                        />
                        <Button onClick={async () => {

                            const id = await guardarComment({
                                comentario: {
                                    content: commentParent,
                                    user: getStorageUser().usuarioId,
                                    receta: idReceta,
                                    type: TypeNotification.CommentToReceta
                                }
                            })
                            setReactions((prevReactions) => ({
                                ...prevReactions,
                                [id]: {
                                    ...prevReactions[id],
                                    estado: false,
                                    count: 0
                                },
                            }));
                            await getDetailsReceta({ recetaId: idReceta })
                            setCommentParent('')
                        }} variant='outlined'>SEND</Button>
                    </div>
                    {
                        console.log("mi details Receta", detailsReceta)
                    }
                    {detailsReceta?.comments?.filter(value => value._id).length > 0
                        ? detailsReceta?.comments?.filter(value => value._id).slice(0, visibleComments).map((comment, index) => (

                            comment._id
                                ?
                                <Paper key={index} style={{ marginBottom: '16px', position: 'relative', padding: '16px' }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}>
                                        <h3>
                                            {comment.user.username} : {comment.content}
                                        </h3>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <IconButton
                                                onClick={() => {
                                                    handleReaction(comment._id, !reactions[comment._id].estado, TypeNotification.LikeToComment, null);
                                                }}
                                            >
                                                <FavoriteIcon
                                                    sx={{ color: reactions[comment._id]?.estado ? 'red' : 'gray', transition: 'color 0.5s' }}
                                                />
                                            </IconButton>
                                            <span>{reactions[comment._id]?.count}</span>
                                        </div>
                                    </div>
                                    {
                                        comment.responses.filter(value => value._id).slice(0, visibleAnswers[index] || 3).map((answerd, i) => (
                                            <Typography key={i} variant="body2" style={{ marginLeft: '16px', position: 'relative' }}>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between'
                                                }}>
                                                    {answerd.user.username} : {answerd.content}
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <IconButton
                                                            onClick={() => {
                                                                handleReaction(answerd._id, !reactions[answerd._id]?.estado, TypeNotification.LikeToAnswerd, answerd.parentComment)
                                                            }}
                                                        >
                                                            <FavoriteIcon
                                                                sx={{ color: reactions[answerd._id]?.estado ? 'red' : 'gray', transition: 'color 0.5s' }}
                                                            />
                                                        </IconButton>
                                                        <span>{reactions[answerd._id]?.count}</span>
                                                    </div>
                                                </div>
                                            </Typography>
                                        ))
                                    }
                                    < div style={{ display: 'flex', flexDirection: 'column', width: '80%' }}>
                                        <div>
                                            <TextField
                                                type='text'
                                                sx={{ paddingRight: '10%' }}
                                                value={responseContent[index] || ''}
                                                onChange={(e) => handleResponseContentChange(index, e.target.value)}
                                            />
                                            <Button variant='outlined' onClick={() => handleSendResponse(index, comment.id, comment._id, TypeNotification.CommentToAnswerd)}>SEND</Button>
                                        </div>
                                        {comment.responses.filter(value => value._id).length > (visibleAnswers[index] || 3) && (
                                            <Button
                                                size="small"
                                                onClick={() => handleShowMoreAnswers(index)}
                                                style={{ marginTop: '8px' }}
                                            >
                                                Show more answers
                                            </Button>
                                        )}
                                    </div>
                                </Paper>
                                : <></>
                        ))
                        : <div><h1>No Comments Yet</h1></div>
                    }
                    {detailsReceta?.comments?.filter(value => value._id).length > visibleComments && (
                        <Button onClick={handleShowMoreComments}>
                            Show more comments
                        </Button>
                    )}
                </Box>
            </Grid>
        </Grid>
    )
}

export default RecipeThirdPart;