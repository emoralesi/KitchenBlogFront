import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { Box, Button, Checkbox, IconButton, Modal, Zoom } from "@mui/material";
import { useEffect, useState } from "react";
import { useUsuario } from "../../Hooks/useUsuario";
import { getStorageUser } from "../../utils/StorageUser";
import { DetailsReceta } from "./Seccion/DitailsReceta";

export const ShoppingList = () => {

    const { ObtenerFavourites, favourites, idFavourites, SaveUpdateMyFavourites, ObtenerIdFavourites } = useUsuario();
    const [openReceta, setOpenReceta] = useState(false)
    const [userId, setUserId] = useState('');
    const [idReceta, setIdReceta] = useState(null);
    const [idSelected, setidSelected] = useState([]);

    useEffect(() => {
        ObtenerFavourites({ idUser: getStorageUser().usuarioId })
        ObtenerIdFavourites({ idUser: getStorageUser().usuarioId })
    }, [])

    const handleBookmarkClick = async (id, action) => {

        await SaveUpdateMyFavourites({ body: { idUser: getStorageUser().usuarioId, idReceta: id, estado: action } })
        await ObtenerFavourites({ idUser: getStorageUser().usuarioId })
    };

    return (
        <div>
            <h1>SELECT YOUR SHOPPING LIST</h1>
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: '15px', padding: '10px' }}>
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
                                <Checkbox defaultChecked color="success" checked={idSelected.includes(card._id)}
                                    onChange={(e) => {
                                        var result = [];
                                        e.target.checked ? result = [...idSelected, card._id] : result = idSelected.filter(favourite => favourite != card._id)

                                        console.log("asi me quedo el setidSelected", result);
                                        setidSelected(result);
                                    }} />
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

                        <DetailsReceta isFull={false} isFromProfile={false} origen={'shippingList'} idReceta={idReceta} setOpen={setOpenReceta} idUser={userId} />
                    </Modal>
                    : <></>
            }
            <div style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px'
            }}>
                <Button color='success' variant='contained' >Generate list</Button>
            </div>
        </div >
    )
}