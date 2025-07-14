import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Box, Button, CircularProgress, Grid, IconButton, Paper, TextField, Typography, Zoom } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Carousel from 'react-material-ui-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useComment } from '../../../Hooks/useComment';
import { useReceta } from '../../../Hooks/useReceta';
import { getStorageUser } from '../../../utils/StorageUser';
import { TypeNotification } from '../../../utils/enumTypeNoti';
import { RecetaNotFound } from './RecetaNotFound';
import RecipeFirstPart from './RecipeFirstPart';
import RecipeSecondPart from './RecipeSecondPart';
import RecipeThirdPart from './RecipeThirdPart';

export const DetailsReceta = ({ isFull, setOpen, idReceta, idUser, isFromProfile, origen, username }) => {
    const [visibleComments, setVisibleComments] = useState(3);
    const [visibleAnswers, setVisibleAnswers] = useState({});
    const [commentParent, setCommentParent] = useState('');
    const [responseContent, setResponseContent] = useState({});
    const [reactions, setReactions] = useState({});
    const { guardarComment } = useComment();
    const { detailsReceta, getDetailsReceta, saveUpdateReactionReceta } = useReceta();
    const [recetaReactions, setRecetaReactions] = useState([]);
    const { SaveUpdateCommentReaction } = useComment();
    const [recipeExists, setRecipeExists] = useState(true);
    const [loading, setLoading] = useState(true);

    const handleClose = () => { setOpen(false); isFromProfile ? window.history.replaceState('', '', `/main/profile/${username}`) : window.history.replaceState('', '', `/main/${origen}`) };


    useEffect(() => {
        const fetchDetailsReceta = async () => {
            try {
                console.log("Ditailsss idUser", idUser);
                const receta = await getDetailsReceta({ recetaId: idReceta });

                if (!receta) {
                    setRecipeExists(false);
                } else {
                    const initialReactions = {};
                    receta.comments.forEach((comment) => {
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
                    setRecetaReactions(receta.reactions);
                    setReactions(initialReactions);
                    setRecipeExists(true);
                }
            } catch (error) {
                console.error('Error fetching data', error);
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
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '80vh',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (!recipeExists) {
        return <RecetaNotFound />;
    }

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
            {
                detailsReceta == null
                    ? <h1>Lo sentimos, no pudimos encontrar la Receta</h1>
                    : <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column', height: '100%', width: '100%', overflow: 'auto' }}>
                        <RecipeFirstPart detailsReceta={detailsReceta} />
                        {/* <RecipeSecondPart data={detailsReceta} /> */}
                        <RecipeThirdPart detailsReceta={detailsReceta} reactions={reactions} setReactions={setReactions} recetaReactions={recetaReactions} setRecetaReactions={setRecetaReactions} idReceta={idReceta} getDetailsReceta={getDetailsReceta} saveUpdateReactionReceta={saveUpdateReactionReceta} />
                    </Box >
            }
        </Box >;
    }
};