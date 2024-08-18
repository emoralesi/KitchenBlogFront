import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { Box, Button, IconButton, Modal, Zoom } from "@mui/material";
import { useEffect, useState } from "react";
import { useReceta } from '../../../Hooks/useReceta';
import { useUsuario } from "../../../Hooks/useUsuario";
import { getStorageUser } from "../../../utils/StorageUser";
import { DetailsReceta } from './DitailsReceta';
import PushPinIcon from '@mui/icons-material/PushPin';

export const Perfil = ({ userName }) => {

    const [openForm, setOpenForm] = useState(false);
    const { getUserAndReceta, misRecetas } = useReceta();
    const [openReceta, setOpenReceta] = useState(false)
    const [idReceta, setIdReceta] = useState(null);
    const [idUser, setIdUser] = useState(null)
    const { getIdUserByUserName, ObtenerIdFavourites, SaveUpdateMyFavourites, idFavourites, setIdFavourites } = useUsuario();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const idUsuario = await getIdUserByUserName({ username: userName }).then((result) => {
                    return result.userId
                });
                console.log("a ver", idUsuario);
                console.log(getIdUserByUserName({ username: userName }));


                setIdUser(idUsuario);
                await getUserAndReceta({ userId: idUsuario });
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };
        ObtenerIdFavourites({ idUser: getStorageUser().usuarioId })
        fetchData();
    }, [userName]);

    const handleBookmarkClick = async (id, action) => {

        var result = [];
        await SaveUpdateMyFavourites({ body: { idUser: getStorageUser().usuarioId, idReceta: id, estado: action } })
        action ? result = [...idFavourites, id] : result = idFavourites.filter(favourite => favourite != id)

        console.log("asi me quedo el idFacourite", result);
        setIdFavourites(result);
    };

    return (
        <Box>
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: '15px' }}>
                {misRecetas?.sort((a, b) => {
                    if (a.pined !== b.pined) {
                        return b.pined - a.pined;
                    }
                    return new Date(b.fechaReceta) - new Date(a.fechaReceta);
                }).map((card, index) => (
                    <Zoom key={card._id} in={true} timeout={300 + (index * 80)}>
                        <Box
                            sx={{
                                p: 2,
                                border: 1,
                                borderRadius: 2,
                                minWidth: "220px", // Minimum width
                                maxWidth: "500px", // Maximum width
                                minHeight: "280px", // Minimum height
                                maxHeight: "620px", // Maximum height
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Button onClick={(e) => {
                                    e.preventDefault();
                                    setIdReceta(card?._id);
                                    window.history.replaceState('', '', `/main/p/${card._id}`);
                                    setOpenReceta(true);
                                }}>open me</Button>
                                {
                                    card?.pined ? <PushPinIcon /> : <></>
                                }
                                {
                                    idFavourites?.includes(card._id)
                                        ? <IconButton
                                            onClick={() => handleBookmarkClick(card._id, false)}
                                            sx={{ transition: 'color 0.3s' }}
                                        >
                                            <BookmarkIcon sx={{ color: 'yellow' }} />

                                        </IconButton>
                                        : <IconButton
                                            onClick={() => handleBookmarkClick(card._id, true)}
                                            sx={{ transition: 'color 0.3s' }}
                                        >
                                            <BookmarkBorderIcon />
                                        </IconButton>
                                }
                            </div>
                            <img src={card?.image} alt={card.title} width="100%" />

                            <h2>{card.titulo}</h2>
                            <p>{card.descripcion}</p>
                            <p>{card._id}</p>
                        </Box>
                    </Zoom>
                ))}
                {
                    misRecetas?.length == 0 ? <h4>Not Recetas Founded</h4> : <></>
                }
            </Box>
            {
                openReceta
                    ?
                    <Modal
                        open={openReceta}
                        closeAfterTransition
                        BackdropProps={{
                            timeout: 500,
                        }}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>

                        <DetailsReceta isFull={false} isFromProfile={true} idReceta={idReceta} setOpen={setOpenReceta} idUser={idUser} />
                    </Modal>
                    : <></>
            }
        </Box>

    );
}