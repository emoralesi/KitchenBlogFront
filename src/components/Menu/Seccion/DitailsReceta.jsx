import CloseIcon from '@mui/icons-material/Close';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Box, Button, Grid, IconButton, Paper, TextField, Typography, Zoom } from '@mui/material';
import React, { useEffect, useState } from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useComment } from '../../../Hooks/useComment';
import { useReceta } from '../../../Hooks/useReceta';
import { getStorageUser } from '../../../utils/StorageUser';
import { TypeNotification } from '../../../utils/enumTypeNoti';

export const DetailsReceta = ({ isFull, setOpen, idReceta, idUser, isFromProfile, origen }) => {
    const [visibleComments, setVisibleComments] = useState(3);
    const [visibleAnswers, setVisibleAnswers] = useState({});
    const [commentParent, setCommentParent] = useState('');
    const [responseContent, setResponseContent] = useState({});
    const [reactions, setReactions] = useState({});
    const { guardarComment } = useComment();
    const { detailsReceta, getDetailsReceta, saveUpdateReactionReceta } = useReceta();
    const [recetaReactions, setRecetaReactions] = useState([]);
    const { SaveUpdateCommentReaction } = useComment();

    const handleClose = () => { setOpen(false); isFromProfile ? window.history.replaceState('', '', `/main/profile/${idUser}`) : window.history.replaceState('', '', `/main/${origen}`) };

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

    useEffect(() => {
        console.log("Ditailsss idUser", idUser);
        getDetailsReceta({ recetaId: idReceta }).then((receta) => {
            const initialReactions = {};
            receta?.comments.forEach((comment) => {
                console.log(comment.reactions);
                initialReactions[comment._id] = {
                    estado: comment.reactions.some(value => value.user_id === getStorageUser().usuarioId),
                    count: comment.reactions.filter(value => value._id).length,
                };
                comment.responses.forEach((response) => {
                    initialReactions[response._id] = {
                        estado: response.reactions.some(value => value.user_id === getStorageUser().usuarioId),
                        count: response.reactions.filter(value => value._id).length,
                    };
                });
            });
            console.log("mi receta", receta);
            setRecetaReactions(receta.reactions);
            setReactions(initialReactions);
        });
        setVisibleComments(2);
        setVisibleAnswers({});
    }, []);

    return (
        isFull ? <>
            {Receta()}
        </>
            : <Zoom timeout={500} in={true}>
                {Receta()}
            </Zoom >
    );

    function Receta() {
        return <Box
            sx={{
                width: isFull ? 'auto' : { xs: '70vw', md: '85vw', lg: '90vw' },
                height: isFull ? 'calc(100% - 4px)' : { xs: '85vh', md: '85vh', lg: '90vh' },
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                p: isFull ? 0 : 4,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {!isFull ?
                <IconButton
                    onClick={handleClose}
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                >
                    <CloseIcon />
                </IconButton>
                : <></>}
            <Grid container spacing={0} sx={{ height: '100%', padding: '5px', overflow: { xs: 'auto', sm: 'auto', md: 'unset' } }}>
                <Grid item xs={12} sm={12} md={6} sx={{
                    height: { xs: '55%', sm: '50%', md: '100%' },
                    width: '100%',
                }}>
                    {
                        console.log("mi details receta", detailsReceta)
                    }
                    {detailsReceta?.images?.map((img, index) => (
                        <div key={index} style={{ height: '100%' }}>
                            <img src={img} alt={`Slide ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    ))}
                </Grid>

                <Grid item xs={12} sm={12} md={6} sx={{
                    paddingLeft: '16px',
                    height: { xs: '45%', sm: '50%', md: '100%' },
                    overflow: { xs: 'unset', md: 'auto' }
                }}>
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
                </Grid >
            </Grid >
        </Box >;
    }
};