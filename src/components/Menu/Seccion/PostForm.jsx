import { Box, Button, Modal, Slide, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { usePost } from '../../../Hooks/usePost';
import { getStorageUser } from '../../../utils/StorageUser';

export const PostForm = ({ open, setOpen, getUserAndPost }) => {

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const handleClose = () => setOpen(false);
    const { guardarPost } = usePost();

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
            <Slide direction="up" in={open}>
                <Box sx={{
                    width: { xs: '85vw', md: '85vw', lg: '90vw' },
                    height: { xs: '85vh', md: '85vh', lg: '90vh' },
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
                        <div style={{ overflow: 'auto', width: '100%', height: '100%' }}>
                            <TextField
                                label="Title"
                                variant="outlined"
                                sx={{ width: '100%' }}
                                value={title}
                                onChange={(e) => { setTitle(e.target.value) }} />
                            <TextField
                                label="Content"
                                sx={{ width: '100%' }}
                                value={content}
                                onChange={(e) => { setContent(e.target.value) }}
                            />
                            <Button variant='contained' color='success' onClick={() => {
                                if (guardarPost({ data: { title: title, content: content, user: getStorageUser().usuarioId } })) {
                                    setOpen(false);
                                    getUserAndPost({ userId: getStorageUser().usuarioId });
                                }
                            }}> ADD</Button>
                        </div>
                    </div>
                </Box>
            </Slide>
        </Modal>
    );
};