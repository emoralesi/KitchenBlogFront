import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { Box, Button, IconButton, Modal, Zoom } from "@mui/material";
import { useEffect, useState } from "react";
import { useUsuario } from "../../../Hooks/useUsuario";
import { getStorageUser } from "../../../utils/StorageUser";
import { DetailsReceta } from "./DitailsReceta";

export const Favourites = ({ userName, setCantidadFavoritos }) => {

    const { ObtenerFavourites, getIdUserByUserName, favourites, idFavourites, SaveUpdateMyFavourites, ObtenerIdFavourites } = useUsuario();
    const [openReceta, setOpenReceta] = useState(false)
    const [idReceta, setIdReceta] = useState(null);
    const [idUsuario, setIdUsiario] = useState(null);
    const [idUsuarioFavourite, setIdUsuarioFAvourite] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const idUser = userName == getStorageUser().username ? getStorageUser().usuarioId : await getIdUserByUserName({ username: userName }).then((result) => {
                    return result.userId
                });
                setIdUsuarioFAvourite(idUser);
                setIdUsiario(getStorageUser().usuarioId);
                await ObtenerFavourites({ idUser: idUser })
                await ObtenerIdFavourites({ idUser: getStorageUser().usuarioId })
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };
        fetchData();
    }, [userName]);

    const handleBookmarkClick = async (id, action) => {

        await SaveUpdateMyFavourites({ body: { idUser: idUsuario, idReceta: id, estado: action } })
        await ObtenerFavourites({ idUser: idUsuarioFavourite })
        await ObtenerIdFavourites({ idUser: idUsuario })

        if (idUsuario == idUsuarioFavourite) {

            action ? setCantidadFavoritos(prevCantidad => prevCantidad + 1) : setCantidadFavoritos(prevCantidad => prevCantidad - 1)
        }
    };

    return (
        <Box>
            {favourites ? <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: '15px' }}>
                {favourites?.favourite?.filter(value => value._id).map((card, index) => (
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
                            <img src={card?.image} alt={card.title} width="100%" />
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Button onClick={(e) => {
                                    e.preventDefault();
                                    setIdReceta(card?._id);
                                    window.history.replaceState('', '', `/main/p/${card._id}`);
                                    setOpenReceta(true);
                                }}>open me</Button>
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
                            <h2>{card.titulo}</h2>
                            <p>{card.descripcion}</p>
                            <p>{card._id}</p>
                        </Box>
                    </Zoom>
                ))}
                {
                    favourites?.favourite?.filter(value => value._id).length == 0 ? <h4>Not Favourites Added</h4> : <></>
                }
            </Box>
                : <h1>No se ecnontraron Favoritos</h1>
            }
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

                        <DetailsReceta isFull={false} isFromProfile={false} origen={'myFavourites'} idReceta={idReceta} setOpen={setOpenReceta} idUser={idUsuario} />
                    </Modal>
                    : <></>
            }
        </Box >
    )
}