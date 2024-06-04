import { Box, Button, Grid, Modal, Paper, Slide, TextField, Typography, Zoom, styled } from '@mui/material';
import { useEffect, useState } from 'react';
import { usePost } from '../../../Hooks/usePost';
import { getStorageUser } from '../../../utils/StorageUser';

export const DitailsPost = ({ open, setOpen, getUserAndPost }) => {

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const handleClose = () => setOpen(false);
    const { guardarPost } = usePost();

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));

    useEffect(() => {
    }, [])

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
                <Box sx={{
                    width: { xs: '90vw', md: '85vw', lg: '90vw' },
                    height: { xs: '90vh', md: '85vh', lg: '90vh' },
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', width: '100%', height: '100%' }}>
                        <Button onClick={handleClose} size='small' sx={{ alignSelf: 'flex-end', height: '30px' }}>
                            X
                        </Button>
                        <Grid container sx={{ overflow: 'auto', width: '100%', height: '100%' }}>
                            <Grid item xs={12} md={6} lg={6}>
                                <Box sx={{ width: '100%', height: '100%', backgroundColor: 'blue' }}>
                                    <h4>xd</h4>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6} lg={6}>
                                <Box sx={{ width: '100%', height: '100%', backgroundColor: 'gray' }}>
                                    <h4>xd</h4>
                                </Box>
                            </Grid>
                        </Grid>
                    </div>
                </Box>
            </Zoom>
        </Modal>
    );
};