// Import necessary modules
import React, { useEffect, useState } from 'react';
import { Box, Modal, Zoom, Typography, Button, IconButton, Grid, Paper, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import carousel styles
import { usePost } from '../../../Hooks/usePost';
import { useComment } from '../../../Hooks/useComment';
import { getStorageUser } from '../../../utils/StorageUser';

export const DetailsPost = ({ isFull, setOpen, idPost }) => {
    // State variables
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [comments, setComments] = useState([]);
    const [visibleComments, setVisibleComments] = useState(3);
    const [visibleAnswers, setVisibleAnswers] = useState({});
    const [images, setImages] = useState([]);
    const [commentParent, setCommentParent] = useState('');
    const { guardarComment } = useComment();

    const { detailsPost, getDetailsPost } = usePost(); // Custom hook

    // Close modal function
    const handleClose = () => { setOpen(false); window.history.replaceState('', '', '/main/miPerfil'); };

    // Show more comments function
    const handleShowMoreComments = () => {
        setVisibleComments((prev) => prev + 3);
    };

    // Show more answers function
    const handleShowMoreAnswers = (index) => {
        setVisibleAnswers((prev) => ({
            ...prev,
            [index]: (prev[index] || 3) + 3,
        }));
    };

    // useEffect to update content when modal opens
    useEffect(() => {
        getDetailsPost({ postId: idPost })
        setVisibleComments(3);
        setVisibleAnswers({});
    }, []);

    // Render the component
    return (
        isFull ? <>
            {Post()}
        </>
            : <Zoom timeout={500} in={true}>
                {Post()}
            </Zoom >
    );

    function Post() {
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
                overflow: 'hidden' // Ensure content is scrollable
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

            {/* Main content */}
            <Grid container spacing={0} sx={{ height: '100%', padding: '5px', overflow: { xs: 'auto', sm: 'auto', md: 'unset' } }}>
                {/* Left Side: Carousel of Images */}
                <Grid item xs={12} sm={12} md={6} sx={{
                    height: { xs: '55%', sm: '50%', md: '100%' }, // Set height for different screen sizes
                    width: '100%', // Ensure Carousel takes 100% width
                }}>
                    {/* <Carousel showThumbs={false} showStatus={false}> */}
                    {detailsPost?.images?.map((img, index) => (
                        <div key={index} style={{ height: '100%' }}>
                            <img src={img} alt={`Slide ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    ))}
                    {/* </Carousel> */}
                </Grid>

                {/* Right Side: Comments */}
                <Grid item xs={12} sm={12} md={6} sx={{
                    paddingLeft: '16px',
                    height: { xs: '45%', sm: '50%', md: '100%' },
                    overflow: { xs: 'unset', md: 'auto' }
                }}>
                    {/* Fixed height for the comment section */}
                    <Box height="100%" sx={{ flex: '1 1 50%', paddingLeft: '16px', height: '100%' }}>
                        <Typography variant="h6" gutterBottom>
                            Comments
                        </Typography>
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
                                await guardarComment({
                                    comentario: {
                                        content: commentParent,
                                        user: getStorageUser().usuarioId,
                                        post: idPost
                                    }
                                })
                                await getDetailsPost({ postId: idPost })
                                setCommentParent('')
                            }} variant='outlined'>SEND</Button>
                        </div>
                        {/* Render comments */}
                        {
                            detailsPost?.comments?.length > 0
                                ?
                                detailsPost?.comments?.slice(0, visibleComments).map((comment, index) => (
                                    <Paper key={index} style={{ marginBottom: '16px', position: 'relative', padding: '16px' }}>
                                        <Typography variant="body1">
                                            {comment.content}
                                            <IconButton sx={{ position: 'absolute', right: 0, top: 0 }}>
                                                <FavoriteBorderIcon />
                                            </IconButton>
                                        </Typography>
                                        {/* Render answers */}
                                        {console.log("mis respuestas", detailsPost?.comments)}
                                        {comment.responses.slice(0, visibleAnswers[index] || 3).map((answerd, i) => (
                                            <Typography key={i} variant="body2" style={{ marginLeft: '16px', position: 'relative' }}>
                                                {answerd.content}
                                                <IconButton sx={{ position: 'absolute', right: 0, top: 0 }}>
                                                    <FavoriteBorderIcon />
                                                </IconButton>
                                            </Typography>
                                        ))}
                                        {/* Show more answers button */}
                                        <div style={{ display: 'flex', flexDirection: 'column', width: '80%' }}>
                                            <div>
                                                <TextField
                                                    type='text'
                                                    sx={{ paddingRight: '10%' }}
                                                />
                                                <Button variant='outlined'>SEND</Button>
                                            </div>
                                            {comment.responses.length > (visibleAnswers[index] || 3) && (
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
                                )

                                ) :
                                <div>
                                    <h1>No Comments Yet</h1>
                                    <div>
                                        <TextField
                                            type='text'
                                            sx={{ paddingRight: '10%' }}
                                        />
                                        <Button variant='outlined'>SEND</Button>
                                    </div>
                                </div>

                        }
                        {/* Show more comments button */}
                        {detailsPost?.comments?.length > visibleComments && (
                            <Button onClick={handleShowMoreComments}>
                                Show more comments
                            </Button>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Box>;
    }
};
