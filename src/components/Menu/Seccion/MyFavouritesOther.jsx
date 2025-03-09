import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddIcon from '@mui/icons-material/Add';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import CommentIcon from '@mui/icons-material/Comment';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { Avatar, Box, Button, Fab, IconButton, Modal, Typography, Zoom } from "@mui/material";
import { useEffect, useRef, useState, useCallback } from "react";
import { useUsuario } from "../../../Hooks/useUsuario";
import { getStorageUser } from "../../../utils/StorageUser";
import { DetailsReceta } from "./DitailsReceta";
import { dateConvert } from '../../../utils/dateConvert';
import { useReceta } from '../../../Hooks/useReceta';
import { TypeNotification } from '../../../utils/enumTypeNoti';
import useNearScreen from '../../../Hooks/useNearScreen';
import debounce from 'just-debounce-it';
import IconSvg from '../../../utils/IconSvg';
import { useNavigate } from 'react-router-dom';
import { simulateDelay } from '../../../utils/Delay';
import { SkeletonWave } from '../../../utils/Skeleton';

export const FavouritesOther = ({ userName, setCantidadFavoritos, cantidadFavoritos }) => {

    const navigate = useNavigate();

    const { ObtenerFavourites, getIdUserByUserName, favourites, idFavourites, SaveUpdateMyFavourites, ObtenerIdFavourites, favouriteInfo, reactionInfo } = useUsuario();
    const { saveUpdateReactionReceta } = useReceta();
    const [openReceta, setOpenReceta] = useState(false)
    const [idReceta, setIdReceta] = useState(null);
    const [idUsuario, setIdUsiario] = useState(null);
    const [idUsuarioFavourite, setIdUsuarioFAvourite] = useState(null);
    const [isExpanded, setIsExpanded] = useState({});
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(15);

    const [loadingNearScreen, setLoadingNearScreen] = useState(false);
    const [loading, setLoading] = useState(true);

    const externalRef = useRef()
    const { isNearScreen } = useNearScreen({
        externalRef: cantidadFavoritos == 0 ? null : externalRef,
        once: false
    })

    const debounceHandleNextPage = useCallback(debounce(
        () => {
            if (favourites.length < cantidadFavoritos) {
                const newLimit = limit + 10;
                setLimit(newLimit);
                setLoadingNearScreen(true);
                ObtenerFavourites({ data: { data: { idUser: idUsuarioFavourite, page, limit: newLimit } } }).finally(() => {
                    setLoadingNearScreen(false);
                })
            }
        }, 250
    ), [favourites])

    useEffect(function () {
        if (isNearScreen) { debounceHandleNextPage() }
        console.log(isNearScreen);

    }, [isNearScreen])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const idUser = await getIdUserByUserName({ username: userName }).then((result) => {
                    return result.userId
                });
                setIdUsuarioFAvourite(idUser);
                setIdUsiario(getStorageUser().usuarioId);
                setLoading(true);
                await simulateDelay(ObtenerFavourites({ data: { data: { idUser: idUser, page, limit } } }))
                await ObtenerIdFavourites({ idUser: getStorageUser().usuarioId })
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };
        fetchData().finally(() => {
            setLoading(false);
        });
    }, [userName]);

    const handleBookmarkClick = async (id, action) => {

        await SaveUpdateMyFavourites({ body: { idUser: idUsuario, idReceta: id, estado: action } })
        await ObtenerIdFavourites({ idUser: idUsuario })
    };

    const handleClickExpand = (cardId) => {
        setIsExpanded(prev => ({
            ...prev,
            [cardId]: !prev[cardId]
        }));
    };

    return (
        <Box>
            {favourites ? <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: '15px' }}>
                {loading ? <SkeletonWave /> :
                    favourites?.filter(value => value._id).map((card, index) => (
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
                                    <div style={{ position: 'absolute', left: 5, top: 5, display: 'flex', alignItems: 'center' }}>
                                        <Button onClick={() => {
                                            navigate(`/main/profile/${card.user[0].username}`)
                                        }}>
                                            <Avatar
                                                sx={{
                                                    width: 50,
                                                    height: 50,
                                                    marginRight: '10px',
                                                    fontSize: 40,
                                                }}
                                                src={card.user[0].profileImageUrl}
                                            >
                                                {card.user[0].username?.substring(0, 1).toUpperCase()}
                                            </Avatar>
                                        </Button>
                                        <p style={{ fontWeight: 'bold' }}>{card.user[0].username}</p>
                                    </div>
                                    <div style={{ position: 'absolute', right: 2, top: 25, display: 'flex', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <IconButton
                                                    onClick={() => {
                                                        handleBookmarkClick(card._id, !favouriteInfo.find(value => value.idReceta == card._id).usuarios_id_favourite.some((user) => user === idUsuario));

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
                                                <p>{favouriteInfo?.find(value => value.idReceta == card._id)?.usuarios_id_favourite.length}</p>
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
                                                    }}
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
                                        overflow: isExpanded[card._id] ? 'auto' : 'none',
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
                                        <ul style={{ height: '100%', padding: '0px 10px 0px 10px', margin: 0, display: 'flex', flexDirection: 'column' }}>
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
                                                        IconSvg(value.nombreSubCategoria)
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
                        </Zoom>
                    ))
                }
                {
                    favourites?.filter(value => value._id).length == 0 ? <h4>Not Favourites Added</h4> : favourites.length > 6 ? <div id="visor" ref={externalRef}></div> : <></>
                }
                {
                    loadingNearScreen ? <SkeletonWave /> : <></>
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