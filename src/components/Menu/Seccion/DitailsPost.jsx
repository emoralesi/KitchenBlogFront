// Import necessary modules
import React, { useEffect, useState } from 'react';
import { Box, Modal, Zoom, Typography, Button, IconButton, Grid, Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import carousel styles
import { usePost } from '../../../Hooks/usePost';

export const DetailsPost = ({ open, setOpen, getUserAndPost }) => {
    // State variables
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [comments, setComments] = useState([]);
    const [visibleComments, setVisibleComments] = useState(3);
    const [visibleAnswers, setVisibleAnswers] = useState({});
    const [images, setImages] = useState([]);

    const { guardarPost } = usePost(); // Custom hook

    // Close modal function
    const handleClose = () => setOpen(false);

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
        if (open) {
            // Hardcoded data for example purposes
            const postDetails = {
                title: "Example Post Title",
                content: "This is an example post content.",
                images: [
                    "https://via.placeholder.com/400",
                ],
                comments: [
                    {
                        text: "This is the first comment.",
                        answers: ["First answer to the first comment.", "Second answer to the first comment.", "Third answer to the first comment.", "Fourth answer to the first comment."]
                    },
                    {
                        text: "This is the second comment.",
                        answers: ["First answer to the second comment."]
                    },
                    {
                        text: "This is the third comment.",
                        answers: ["First answer to the third comment."]
                    },
                    {
                        text: "This is the fourth comment.",
                        answers: []
                    },
                    {
                        text: "This is the fifth comment.",
                        answers: []
                    },
                    {
                        text: "This is the sixth comment.",
                        answers: []
                    },
                    {
                        text: "This is the seventh comment.",
                        answers: []
                    },
                ]
            };
            setTitle(postDetails.title);
            setContent(postDetails.content);
            setImages(postDetails.images);
            setComments(postDetails.comments);
            setVisibleComments(3);
            setVisibleAnswers({});
        }
    }, [open]);

    // Render the component
    return (
        <Modal
            open={open}
            closeAfterTransition
            BackdropProps={{
                timeout: 500,
            }}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Zoom timeout={500} in={open}>
                <Box
                    sx={{
                        width: { xs: '70vw', md: '85vw', lg: '90vw' },
                        height: { xs: '85vh', md: '85vh', lg: '90vh' },
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'relative',
                        overflow: 'hidden' // Ensure content is scrollable
                    }}
                >
                    {/* Close button */}
                    <IconButton
                        onClick={handleClose}
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>

                    {/* Main content */}
                    <Grid container spacing={0} sx={{ height: '100%', padding: '5px', overflow: { xs: 'auto', md: 'unset' } }}>
                        {/* Left Side: Carousel of Images */}
                        <Grid item xs={12} md={6} sx={{
                            height: { xs: '55%', sm: '50%', md: '100%' }, // Set height for different screen sizes
                            width: '100%', // Ensure Carousel takes 100% width
                        }}>
                            {/* <Carousel showThumbs={false} showStatus={false}> */}
                            {images.map((img, index) => (
                                <div key={index} style={{ height: '100%' }}>
                                    <img src={img} alt={`Slide ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            ))}
                            {/* </Carousel> */}
                        </Grid>

                        {/* Right Side: Comments */}
                        <Grid item xs={12} md={6} sx={{
                            paddingLeft: '16px',
                            height: { xs: '45%', sm: '50%', md: '100%' },
                            overflow: { xs: 'unset', md: 'auto' }
                        }}>
                            {/* Fixed height for the comment section */}
                            <Box height="100%" sx={{ flex: '1 1 50%', paddingLeft: '16px', height: '100%' }}>
                                <Typography variant="h6" gutterBottom>
                                    Comments
                                </Typography>
                                {/* Render comments */}
                                {comments.slice(0, visibleComments).map((comment, index) => (
                                    <Paper key={index} style={{ marginBottom: '16px', position: 'relative', padding: '16px' }}>
                                        <Typography variant="body1">
                                            {comment.text}
                                            <IconButton sx={{ position: 'absolute', right: 0, top: 0 }}>
                                                <FavoriteBorderIcon />
                                            </IconButton>
                                        </Typography>
                                        {/* Render answers */}
                                        {comment.answers.slice(0, visibleAnswers[index] || 3).map((answer, i) => (
                                            <Typography key={i} variant="body2" style={{ marginLeft: '16px', position: 'relative' }}>
                                                {answer}
                                                <IconButton sx={{ position: 'absolute', right: 0, top: 0 }}>
                                                    <FavoriteBorderIcon />
                                                </IconButton>
                                            </Typography>
                                        ))}
                                        {/* Show more answers button */}
                                        {comment.answers.length > (visibleAnswers[index] || 3) && (
                                            <Button
                                                size="small"
                                                onClick={() => handleShowMoreAnswers(index)}
                                                style={{ marginTop: '8px' }}
                                            >
                                                Show more answers
                                            </Button>
                                        )}
                                    </Paper>
                                ))}
                                {/* Show more comments button */}
                                {comments.length > visibleComments && (
                                    <Button onClick={handleShowMoreComments}>
                                        Show more comments
                                    </Button>
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Zoom>
        </Modal >
    );
};
