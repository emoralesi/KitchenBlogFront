import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddIcon from '@mui/icons-material/Add';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import CommentIcon from '@mui/icons-material/Comment';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import PushPinIcon from '@mui/icons-material/PushPin';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { Box, Button, Fab, IconButton, Modal, Typography, Zoom } from "@mui/material";
import { useEffect, useState } from "react";
import { useReceta } from '../../../Hooks/useReceta';
import { useUsuario } from "../../../Hooks/useUsuario";
import { getStorageUser } from "../../../utils/StorageUser";
import { DetailsReceta } from './DitailsReceta';
import { dateConvert } from '../../../utils/dateConvert';

export const PerfilOther = ({ userName }) => {

    const [openForm, setOpenForm] = useState(false);
    const { getUserAndReceta, misRecetas } = useReceta();
    const [openReceta, setOpenReceta] = useState(false)
    const [idReceta, setIdReceta] = useState(null);
    const [idUser, setIdUser] = useState(null)
    const { getIdUserByUserName, ObtenerIdFavourites, SaveUpdateMyFavourites, idFavourites, setIdFavourites } = useUsuario();
    const [isExpanded, setIsExpanded] = useState({});
    const [reactionInfo, setReactionInfo] = useState(null);
    const [favouriteInfo, setFavouriteInfo] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const idUsuario = await getIdUserByUserName({ username: userName }).then((result) => {
                    return result.userId
                });
                console.log("a ver", idUsuario);
                console.log(getIdUserByUserName({ username: userName }));


                setIdUser(idUsuario);
                await getUserAndReceta({ userId: idUsuario }).then((res) => {
                    setReactionInfo(res.map(recipe => {
                        return {
                            idReceta: recipe._id,
                            usuarios_id_reaction: recipe.reactions.map(reaction => reaction.user_id)
                        };
                    }))

                    setFavouriteInfo(res.map(recipe => {
                        return {
                            idReceta: recipe._id,
                            usuarios_id_favourite: recipe.favourite
                        }
                    }))
                });
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

    const handleClickExpand = (cardId) => {
        setIsExpanded(prev => ({
            ...prev,
            [cardId]: !prev[cardId]
        }));
    };

    return (
        <Box>
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: '15px' }}>
                {misRecetas?.sort((a, b) => {
                    if (a.pined !== b.pined) {
                        return b.pined - a.pined;
                    }
                    return new Date(b.fechaReceta) - new Date(a.fechaReceta);
                }).map((card, index) => (
                    <Zoom key={card._id} in={true} timeout={300 + (index * 80)}>
                        <Box
                            sx={{
                                p: 0,
                                border: 1,
                                position: 'relative',
                                borderRadius: 2,
                                height: '58vh',
                                display: 'flex', // Usar flexbox para organizar el contenido
                                flexDirection: 'column', // Colocar elementos en columnas
                            }}
                        >
                            {/* Box que contiene la imagen */}
                            <Box
                                sx={{
                                    width: '100%',
                                    height: isExpanded[card._id] ? '0%' : '50%',
                                    transition: 'ease-in-out 0.5s',
                                    position: 'relative'
                                }}
                            >
                                <Button
                                    onClick={() => {
                                        setIdReceta(card?._id);
                                        window.history.replaceState('', '', `/main/p/${card._id}`);
                                        setOpenReceta(true);
                                    }}
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        p: 0,
                                        position: 'relative', // Necesario para posicionar el texto en el centro
                                        overflow: 'hidden', // Asegura que el contenido extra no se salga del botón
                                        '&:hover .overlay': {
                                            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Oscurece el contenido en hover
                                        },
                                        '&:hover .text': {
                                            opacity: 1, // Muestra el texto en hover
                                        },
                                    }}
                                >
                                    <img
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            borderRadius: '8px 8px 0px 0px',
                                        }}
                                        srcSet={card ? card.images[0] : null}
                                        src={card ? card.images[0] : null}
                                        alt="Imagen"
                                        loading="lazy"
                                    />

                                    {/* Caja para la superposición oscura */}
                                    <Box
                                        className="overlay"
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            backgroundColor: 'rgba(0, 0, 0, 0)', // Transparente por defecto
                                            transition: 'background-color 0.3s ease', // Suaviza la transición del color de fondo
                                        }}
                                    />

                                    {/* Texto que aparece en el hover */}
                                    <Typography
                                        className="text"
                                        sx={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            color: 'white',
                                            opacity: 0, // Oculto por defecto
                                            transition: 'opacity 0.3s ease', // Suaviza la transición de la opacidad
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        See more
                                    </Typography>
                                </Button>
                                {card?.pined ? <div style={{ position: 'absolute', right: 0, top: -10, display: 'flex', alignItems: 'center', rotate: '20px' }}>
                                    <PushPinIcon sx={{ fontSize: '25px' }} />
                                </div> : <></>}

                                <div style={{ position: 'absolute', right: 2, top: 25, display: 'flex', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <IconButton
                                                onClick={() => {
                                                    handleBookmarkClick(card._id, !favouriteInfo.find(value => value.idReceta = card._id).usuarios_id_favourite.some((user) => user === getStorageUser().usuarioId));

                                                    const receta = favouriteInfo.find(value => value.idReceta === card?._id);

                                                    const userExists = receta.usuarios_id_favourite.some(value => value === getStorageUser().usuarioId);

                                                    let updatedUsuariosIdFavourite;

                                                    if (userExists) {
                                                        updatedUsuariosIdFavourite = receta.usuarios_id_favourite.filter(value => value !== getStorageUser().usuarioId);
                                                    } else {
                                                        updatedUsuariosIdFavourite = [...receta.usuarios_id_favourite, getStorageUser().usuarioId];
                                                    }

                                                    const updatedFavouriteInfo = favouriteInfo.map(item =>
                                                        item.idReceta === card?._id ? { ...item, usuarios_id_favourite: updatedUsuariosIdFavourite } : item
                                                    );

                                                    setFavouriteInfo(updatedFavouriteInfo);

                                                }
                                                }
                                                sx={{ transition: 'color 0.3s', padding: 0 }}
                                            >
                                                {idFavourites?.includes(card._id) ? <BookmarkIcon fontSize='large' sx={{ color: 'yellow' }} /> : <BookmarkBorderIcon fontSize='large' />}
                                            </IconButton>
                                            <p>{favouriteInfo?.find(value => value.idReceta = card._id).usuarios_id_favourite.length}</p>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <IconButton
                                                onClick={() => {

                                                    saveUpdateReactionReceta({ data: { idReceta: card?._id, idUser: getStorageUser().usuarioId, estado: !reactionInfo.find(value => value.idReceta === card?._id).usuarios_id_reaction.some(value => value === getStorageUser().usuarioId), type: TypeNotification.LikeToReceta } })
                                                    const receta = reactionInfo.find(value => value.idReceta === card?._id);

                                                    const userExists = receta.usuarios_id_reaction.some(value => value === getStorageUser().usuarioId);

                                                    let updatedUsuariosIdReaction;

                                                    if (userExists) {
                                                        updatedUsuariosIdReaction = receta.usuarios_id_reaction.filter(value => value !== getStorageUser().usuarioId);
                                                    } else {
                                                        updatedUsuariosIdReaction = [...receta.usuarios_id_reaction, getStorageUser().usuarioId];
                                                    }

                                                    const updatedReactionInfo = reactionInfo.map(item =>
                                                        item.idReceta === card?._id ? { ...item, usuarios_id_reaction: updatedUsuariosIdReaction } : item
                                                    );

                                                    setReactionInfo(updatedReactionInfo);
                                                }

                                                }
                                            >
                                                <FavoriteIcon
                                                    sx={{
                                                        color: reactionInfo.find(value => value.idReceta === card?._id).usuarios_id_reaction.some(value => value == getStorageUser().usuarioId) ? 'red' : 'gray', transition: 'color 0.5s'
                                                    }}
                                                />
                                            </IconButton>
                                            <span>{reactionInfo.find(value => value.idReceta === card?._id).usuarios_id_reaction.length}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <IconButton onClick={() => {
                                                setIdReceta(card?._id);
                                                window.history.replaceState('', '', `/main/p/${card._id}`);
                                                setOpenReceta(true);
                                            }}>
                                                <CommentIcon sx={{ color: 'blue', width: '34px' }} />
                                            </IconButton>
                                            <p>{card?.comments.length}</p>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        zIndex: 1, // Para asegurar que el Fab esté sobre los demás elementos
                                    }}
                                >
                                    <Fab
                                        aria-label="add"
                                        onClick={() => { handleClickExpand(card?._id) }}
                                        sx={{ height: '30px', width: '30px', minHeight: 'unset', color: 'black', boxShadow: 'unset', backgroundColor: 'white' }}
                                    >
                                        {isExpanded[card?._id] ? <RemoveCircleIcon /> : <AddIcon />}
                                    </Fab>
                                </div>
                            </Box>
                            <Box
                                sx={{
                                    width: '100%',
                                    height: isExpanded[card._id] ? '100%' : '50%',
                                    transition: 'ease-in-out 0.5s',
                                    backgroundColor: 'white', // Fondo blanco
                                    borderRadius: '0px 0px 8px 8px',
                                    overflow: 'auto', // Centra el contenido horizontalmente
                                    scrollbarWidth: 'thin',
                                    clipPath: 'border-box',
                                    position: 'relative'
                                }}
                            >
                                <div style={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex', // Usar flexbox para centrar el contenido
                                    flexDirection: 'column',
                                    justifyContent: 'center'
                                }}>
                                    <ul style={{ height: '100%', padding: '0px 0px 0px 10px', margin: 0, display: 'flex', flexDirection: 'column' }}>
                                        <h3>{card?.titulo}</h3>
                                        <div style={{ display: 'flex', alignItems: 'center', height: '15px' }}>
                                            <AccessTimeIcon />
                                            <p>{card?.hours > 0 ? card?.hours + "h " + card?.minutes + "m" : card?.minutes + "M"}</p>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <PersonIcon />
                                                <p>{card?.cantidadPersonas}</p>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <AssignmentIcon />
                                                <p>{card?.dificultad[0].nombreDificultad}</p>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <RestaurantIcon />
                                                <p>{card?.categoria[0].nombreCategoria}</p>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            {
                                                card?.subCategoria.map((value) =>
                                                    <p>{value.nombreSubCategoria}</p>
                                                )
                                            }
                                        </div>

                                        <p>{dateConvert(card?.fechaReceta)}</p>
                                        <p>{card?.descripcion}</p>

                                        <h3>INGREDIENTS</h3>
                                        {
                                            card?.grupoIngrediente?.map((value) => (
                                                <div key={value.nombreGrupo}>
                                                    <h4>{value.nombreGrupo}</h4>
                                                    {value.item.map((value2, index) => (
                                                        <p>{`${value2.valor} ${value2.medida.nombreMedida == 'Quantity' ? '' : value2.medida.nombreMedida} ${value2.ingrediente.nombreIngrediente}`}</p>
                                                    ))}
                                                </div>
                                            ))
                                        }
                                    </ul>
                                </div>
                            </Box>
                        </Box>
                        {/* <Box
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
                        </Box> */}
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

                        <DetailsReceta isFull={false} isFromProfile={true} idReceta={idReceta} setOpen={setOpenReceta} idUser={idUser} username={userName} />
                    </Modal>
                    : <></>
            }
        </Box>

    );
}