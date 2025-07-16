import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AddIcon from "@mui/icons-material/Add";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ClearIcon from "@mui/icons-material/Clear";
import CommentIcon from "@mui/icons-material/Comment";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PersonIcon from "@mui/icons-material/Person";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import SearchIcon from "@mui/icons-material/Search";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  Fab,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
  Zoom,
} from "@mui/material";
import debounce from "just-debounce-it";
import { enqueueSnackbar } from "notistack";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCategoria } from "../../../Hooks/useCategoria";
import { useIngrediente } from "../../../Hooks/useIngrediente";
import useNearScreen from "../../../Hooks/useNearScreen";
import { useReceta } from "../../../Hooks/useReceta";
import { useSubCategoria } from "../../../Hooks/useSubCategoria";
import { useUsuario } from "../../../Hooks/useUsuario";
import { dateConvert } from "../../../utils/dateConvert";
import { TypeNotification } from "../../../utils/enumTypeNoti";
import IconSvg from "../../../utils/IconSvg";
import { SkeletonWave } from "../../../utils/Skeleton";
import { getStorageUser } from "../../../utils/StorageUser";
import { DetailsReceta } from "./DitailsReceta";

export const DescoveryRecipe = () => {
  const navigate = useNavigate();

  const {
    ObtenerRecetasInfo,
    recetasInfo,
    cantidadReceta,
    saveUpdateReactionReceta,
    reactionInfo,
    favouriteInfo,
    setReactionInfo,
    setFavouriteInfo,
  } = useReceta();
  const [openReceta, setOpenReceta] = useState(false);
  const [idReceta, setIdReceta] = useState(null);
  const [idUser, setIdUser] = useState(null);
  const {
    getIdUserByUserName,
    ObtenerIdFavourites,
    SaveUpdateMyFavourites,
    idFavourites,
    setIdFavourites,
  } = useUsuario();
  const [isExpanded, setIsExpanded] = useState({});
  const [textSearch, setTextSearch] = useState("");
  const [filterBy, setFilterBy] = useState({
    categoria: "",
    subCategoria: "",
    ingredientes: [],
  });

  const [errorSearch, setErrorSearch] = useState(false);
  const [filterSearch, setFilterSearch] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9);
  const [previousLength, setPreviousLength] = useState(0);
  const [categoria, setCategoria] = useState("");
  const [subCategoria, setSubCategoria] = useState([]);
  const [ingredientes, setIngredientes] = useState([]);

  const [loadingNearScreen, setLoadingNearScreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchState, setSearchState] = useState(false);

  const { ObtenerCategoria, categoriasAll } = useCategoria();
  const { ObtenerSubCategorias, subCategoriasAll } = useSubCategoria();
  const { ObtenerIngrediente, ingredientesAll } = useIngrediente();

  const GetAllRecipes = async () => {
    setLoading(true);
    ObtenerRecetasInfo({ data: { page, limit } })
      .then((res) => {
        setReactionInfo(
          res.Recetas?.map((recipe) => {
            return {
              idReceta: recipe._id,
              usuarios_id_reaction: recipe.reactions.map(
                (reaction) => reaction.user_id
              ),
            };
          })
        );
        setFavouriteInfo(
          res.Recetas?.map((recipe) => {
            return {
              idReceta: recipe._id,
              usuarios_id_favourite: recipe.favourite,
            };
          })
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleToggleSubCategoria = (categoryId) => {
    if (subCategoria.includes(categoryId)) {
      setSubCategoria(subCategoria.filter((id) => id !== categoryId));
    } else {
      setSubCategoria([...subCategoria, categoryId]);
    }
  };

  const externalRef = useRef();
  const { isNearScreen } = useNearScreen({
    externalRef: cantidadReceta == null ? null : externalRef,
    once: false,
  });

  const debounceHandleNextPage = useCallback(
    debounce(() => {
      if (recetasInfo.length < cantidadReceta && cantidadReceta !== null) {
        const newLimit = limit + 9;
        setPreviousLength(recetasInfo.length);
        setLimit(newLimit);
        setLoadingNearScreen(true);
        ObtenerRecetasInfo({
          data: {
            page,
            limit: newLimit,
            filter: {
              titulo: filterSearch,
              categoria: filterBy.categoria,
              subCategoria: filterBy.subCategoria,
              ingredientes: filterBy.ingredientes,
            },
          },
        }).finally(() => {
          setLoadingNearScreen(false);
        });
      }
    }, 250),
    [recetasInfo]
  );

  useEffect(
    function () {
      if (isNearScreen && !loading) {
        debounceHandleNextPage();
      }
    },
    [isNearScreen]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIdUser(getStorageUser().usuarioId);
        await GetAllRecipes();
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    ObtenerIdFavourites({ idUser: getStorageUser().usuarioId });
    fetchData();
    ObtenerCategoria();
    ObtenerSubCategorias();
    ObtenerIngrediente();
  }, []);

  const handleBookmarkClick = async (id, action) => {
    var result = [];
    await SaveUpdateMyFavourites({
      body: {
        idUser: getStorageUser().usuarioId,
        idReceta: id,
        estado: action,
      },
    });
    action
      ? (result = [...idFavourites, id])
      : (result = idFavourites.filter((favourite) => favourite != id));

    setIdFavourites(result);
  };

  const handleClickExpand = (cardId) => {
    setIsExpanded((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  const [showClearIcon, setShowClearIcon] = useState("none");

  const handleChange = (event) => {
    setTextSearch(event.target.value);
    setShowClearIcon(event.target.value === "" ? "none" : "flex");
  };

  const handleClick = () => {
    setTextSearch("");
    setShowClearIcon("none");
  };

  const GetRecipeAction = () => {
    if (
      subCategoria?.length == 0 &&
      categoria == "" &&
      ingredientes?.length == 0
    ) {
      enqueueSnackbar("No tiene filtros seleccionados", { variant: "warning" });
      return;
    }

    setLoading(true);

    const filter = {
      titulo: filterSearch,
      categoria: categoria !== "" ? categoria : null,
      subCategoria,
      ingredientes,
    };

    setFilterBy({
      categoria: categoria !== "" ? categoria : null,
      subCategoria: subCategoria,
      ingredientes: ingredientes,
    });
    console.log("mi filtro", filter);

    ObtenerRecetasInfo({
      data: {
        page,
        limit,
        filter,
      },
    })
      .then((res) => {
        setReactionInfo(
          res.Recetas?.map((recipe) => ({
            idReceta: recipe._id,
            usuarios_id_reaction: recipe.reactions.map(
              (reaction) => reaction.user_id
            ),
          }))
        );
        setFavouriteInfo(
          res.Recetas?.map((recipe) => ({
            idReceta: recipe._id,
            usuarios_id_favourite: recipe.favourite,
          }))
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Box
      sx={{
        height: "100%",
        marginTop: "10px",
        marginRight: "10px",
        marginLeft: "10px",
      }}
    >
      <Box sx={{ height: "auto", width: "100%", marginBottom: "20px" }}>
        <div id="app" style={{ width: "100%", height: "100%" }}>
          <Grid
            container
            spacing={2}
            alignItems="center"
            sx={{ marginBottom: "20px", marginTop: "10px" }}
          >
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <TextField
                  size="small"
                  variant="outlined"
                  error={errorSearch}
                  helperText={errorSearch ? "Type 3 words at least" : null}
                  placeholder="Type at least 3 words..."
                  onChange={handleChange}
                  onKeyDown={debounce((ev) => {
                    if (ev.key === "Enter") {
                      if (textSearch.length >= 0 && textSearch.length < 3) {
                        setErrorSearch(true);
                        return;
                      } else {
                        if (errorSearch) {
                          setErrorSearch(false);
                        }
                        setFilterSearch(textSearch);

                        ObtenerRecetasInfo({
                          data: {
                            page,
                            limit,
                            filter: {
                              titulo: filterSearch,
                              categoria: filterBy.categoria,
                              subCategoria: filterBy.subCategoria,
                              ingredientes: filterBy.ingredientes,
                            },
                          },
                        }).then((res) => {
                          setReactionInfo(
                            res.Recetas?.map((recipe) => {
                              return {
                                idReceta: recipe._id,
                                usuarios_id_reaction: recipe.reactions.map(
                                  (reaction) => reaction.user_id
                                ),
                              };
                            })
                          );

                          setFavouriteInfo(
                            res.Recetas?.map((recipe) => {
                              return {
                                idReceta: recipe._id,
                                usuarios_id_favourite: recipe.favourite,
                              };
                            })
                          );
                        });
                        setSearchState(true);
                        setLimit(15);
                        return;
                      }
                    }
                  }, 800)}
                  value={textSearch}
                  InputProps={{
                    startAdornment: (
                      <IconButton
                        onClick={() => {
                          if (textSearch.length < 3) {
                            setErrorSearch(true);
                          } else {
                            errorSearch ? setErrorSearch(false) : null;
                          }
                        }}
                        position="start"
                      >
                        <SearchIcon />
                      </IconButton>
                    ),
                    endAdornment: (
                      <IconButton
                        position="end"
                        style={{ display: showClearIcon }}
                        onClick={handleClick}
                      >
                        <ClearIcon />
                      </IconButton>
                    ),
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Grid container spacing={1}>
                {filterSearch && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Buscando por: <strong>{filterSearch}</strong>
                    </Typography>
                  </Grid>
                )}
                <Grid item xs={12} md={6}>
                  <Button
                    variant="contained"
                    onClick={() => {
                      if (textSearch.length < 3) {
                        setErrorSearch(true);
                      } else {
                        errorSearch ? setErrorSearch(false) : null;
                        if (textSearch.length > 0 && textSearch.length < 3) {
                          setErrorSearch(true);
                          return;
                        } else {
                          if (errorSearch) {
                            setErrorSearch(false);
                          }
                          setFilterSearch(textSearch);
                          setLoading(true);
                          ObtenerRecetasInfo({
                            data: {
                              page,
                              limit,
                              filter: {
                                titulo: textSearch,
                                categoria: filterBy.categoria,
                                subCategoria: filterBy.subCategoria,
                                ingredientes: filterBy.ingredientes,
                              },
                            },
                          })
                            .then((res) => {
                              setReactionInfo(
                                res.Recetas?.map((recipe) => ({
                                  idReceta: recipe._id,
                                  usuarios_id_reaction: recipe.reactions.map(
                                    (reaction) => reaction.user_id
                                  ),
                                }))
                              );
                              setFavouriteInfo(
                                res.Recetas?.map((recipe) => ({
                                  idReceta: recipe._id,
                                  usuarios_id_favourite: recipe.favourite,
                                }))
                              );
                            })
                            .finally(() => {
                              setLoading(false);
                            });
                          setSearchState(true);
                          setLimit(15);
                          return;
                        }
                      }
                    }}
                    fullWidth
                  >
                    BUSCAR
                  </Button>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Button
                    variant="outlined"
                    disabled={!searchState}
                    onClick={async () => {
                      //await GetAllRecipes();
                      ObtenerRecetasInfo({
                        data: {
                          page,
                          limit,
                          filter: {
                            titulo: null,
                            categoria: filterBy.categoria,
                            subCategoria: filterBy.subCategoria,
                            ingredientes: filterBy.ingredientes,
                          },
                        },
                      });
                      setSearchState(false);
                      setFilterSearch(null);
                    }}
                    fullWidth
                  >
                    RESETEAR
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
        <Accordion sx={{ width: "100%" }}>
          <AccordionSummary
            expandIcon={<ArrowDropDownIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography>Filter</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2} alignItems="center">
              <Grid item md={6} xs={12}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                  >
                    <MenuItem key={"emptyone"} value={""}>
                      <p>NOT SELECTED</p>
                    </MenuItem>
                    {categoriasAll.map((category) => (
                      <MenuItem key={category._id} value={category._id}>
                        {category.nombreCategoria}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Ingredients</InputLabel>
                  <Select
                    multiple
                    value={ingredientes}
                    onChange={(e) => setIngredientes(e.target.value)}
                  >
                    {ingredientesAll?.map((ingrediente) => (
                      <MenuItem key={ingrediente._id} value={ingrediente._id}>
                        {ingrediente.nombreIngrediente}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Subcategories</Typography>
                <Grid container spacing={1}>
                  {subCategoriasAll.map((subCategory) => {
                    const isSelected = subCategoria.includes(subCategory._id);
                    return (
                      <Grid item xs={4} key={subCategory._id}>
                        <Button
                          fullWidth
                          variant={isSelected ? "contained" : "outlined"}
                          onClick={() =>
                            handleToggleSubCategoria(subCategory._id)
                          }
                          sx={{
                            transition: "background-color 0.3s",
                            "&:hover": {
                              backgroundColor: isSelected
                                ? "rgba(0, 0, 0, 0.12)"
                                : "rgba(0, 0, 0, 0.04)",
                            },
                          }}
                        >
                          {subCategory.nombreSubCategoria}
                        </Button>
                      </Grid>
                    );
                  })}
                </Grid>
              </Grid>
              <Grid
                item
                xs={12}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "16px",
                }}
              >
                <Button
                  onClick={GetRecipeAction}
                  variant="contained"
                  color="secondary"
                >
                  FILTER
                </Button>
                <Button
                  onClick={() => {
                    if (
                      subCategoria?.length == 0 &&
                      categoria == "" &&
                      ingredientes?.length == 0
                    ) {
                      return;
                    }

                    setCategoria("");
                    setSubCategoria([]);
                    setIngredientes([]);

                    setFilterBy({
                      categoria: "",
                      subCategoria: "",
                      ingredientes: [],
                    });

                    setLoading(true);

                    ObtenerRecetasInfo({
                      data: {
                        page,
                        limit,
                        filter: {
                          titulo: filterSearch,
                        },
                      },
                    })
                      .then((res) => {
                        setReactionInfo(
                          res.Recetas?.map((recipe) => ({
                            idReceta: recipe._id,
                            usuarios_id_reaction: recipe.reactions.map(
                              (reaction) => reaction.user_id
                            ),
                          }))
                        );
                        setFavouriteInfo(
                          res.Recetas?.map((recipe) => ({
                            idReceta: recipe._id,
                            usuarios_id_favourite: recipe.favourite,
                          }))
                        );
                      })
                      .finally(() => {
                        setLoading(false);
                      });
                  }}
                  variant="outlined"
                >
                  CLEAR
                </Button>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Box>
      <Box
        sx={{
          display: "grid",
          gap: "15px",
          gridTemplateColumns: {
            xs: "1fr", // mobile: 1 item por fila
            sm: "repeat(2, 1fr)", // pantallas medianas: 2 items por fila
            md: "repeat(3, 1fr)", // pantallas grandes: 3 items por fila
          },
        }}
      >
        {loading ? (
          <SkeletonWave />
        ) : (
          <>
            {[...recetasInfo]
              ?.sort((a, b) => {
                return new Date(b.fechaReceta) - new Date(a.fechaReceta);
              })
              .map((card, index) => {
                const isNew = index >= previousLength;
                const animationIndex = isNew ? index - previousLength : 0;
                return (
                  <Zoom
                    key={card._id}
                    in={true}
                    timeout={300}
                    style={{
                      transitionDelay: isNew
                        ? `${animationIndex * 100}ms`
                        : "0ms",
                    }}
                  >
                    <Box
                      sx={{
                        p: 0,
                        border: 1,
                        position: "relative",
                        borderRadius: 2,
                        maxHeight: "54vh",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Box
                        sx={{
                          width: "100%",
                          height: isExpanded[card._id] ? "0%" : "50%",
                          transition: "ease-in-out 0.5s",
                          position: "relative",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Box
                          sx={{
                            height: isExpanded[card._id] ? 0 : "20%",
                            opacity: isExpanded[card._id] ? 0 : 1,
                            transition: "height 0.5s ease, opacity 0.5s ease",
                            alignItems: "center",
                            padding: isExpanded[card._id] ? 0 : "8px",
                            backgroundColor: "white",
                            display: "flex",
                            zIndex: 2,
                            margin: "3px 0px 3px 0px",
                          }}
                        >
                          <Button
                            onClick={() => {
                              navigate(
                                `/main/profile/${card.user[0].username}`
                              );
                            }}
                            sx={{ padding: 0, marginRight: 1 }}
                          >
                            <Avatar
                              sx={{
                                width: 50,
                                height: 50,
                                marginRight: "10px",
                                fontSize: 40,
                              }}
                              src={card.user[0].profileImageUrl}
                            >
                              {card.user[0].username
                                ?.substring(0, 1)
                                .toUpperCase()}
                            </Avatar>
                          </Button>
                          <Typography
                            sx={{
                              fontWeight: "bold",
                              height: isExpanded[card._id] ? 0 : "auto",
                              opacity: isExpanded[card._id] ? 0 : 1,
                              overflow: "hidden",
                              transition:
                                "opacity 0.5s ease-in-out, height 0.3s ease",
                            }}
                          >
                            {card.user[0].username}
                          </Typography>
                        </Box>
                        <Button
                          onClick={() => {
                            setIdReceta(card?._id);
                            window.history.replaceState(
                              "",
                              "",
                              `/main/p/${card._id}`
                            );
                            setOpenReceta(true);
                          }}
                          sx={{
                            width: "calc(100% - 60px)",
                            marginLeft: "5px",
                            flexGrow: 1,
                            p: 0,
                            position: "relative",
                            overflow: "hidden",
                            "&:hover .overlay": {
                              backgroundColor: "rgba(0, 0, 0, 0.5)",
                            },
                            "&:hover .text": {
                              opacity: 1,
                            },
                          }}
                        >
                          <img
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: "8px 8px 0px 0px",
                            }}
                            srcSet={card ? card.images[0] : null}
                            src={card ? card.images[0] : null}
                            alt="Imagen"
                            loading="lazy"
                          />
                          <Box
                            className="overlay"
                            sx={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              backgroundColor: "rgba(0, 0, 0, 0)", // Transparente por defecto
                              transition: "background-color 0.3s ease", // Suaviza la transición del color de fondo
                            }}
                          />

                          <Typography
                            className="text"
                            sx={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              color: "white",
                              opacity: 0, // Oculto por defecto
                              transition: "opacity 0.3s ease", // Suaviza la transición de la opacidad
                              fontWeight: "bold",
                            }}
                          >
                            See more
                          </Typography>
                        </Button>
                        <div
                          style={{
                            position: "absolute",
                            right: 2,
                            top: 50,
                            display: "grid",
                            gridTemplateColumns: "auto auto",
                            alignItems: "center",
                            columnGap: "0px",
                            rowGap: "10px",
                            width: "60px",
                          }}
                        >
                          <IconButton
                            onClick={() => {
                              handleBookmarkClick(
                                card._id,
                                !favouriteInfo
                                  .find((value) => value.idReceta == card._id)
                                  .usuarios_id_favourite.some(
                                    (user) =>
                                      user === getStorageUser().usuarioId
                                  )
                              );

                              const receta = favouriteInfo.find(
                                (value) => value.idReceta === card?._id
                              );

                              const userExists =
                                receta.usuarios_id_favourite.some(
                                  (value) =>
                                    value === getStorageUser().usuarioId
                                );

                              let updatedUsuariosIdFavourite;

                              if (userExists) {
                                updatedUsuariosIdFavourite =
                                  receta.usuarios_id_favourite.filter(
                                    (value) =>
                                      value !== getStorageUser().usuarioId
                                  );
                              } else {
                                updatedUsuariosIdFavourite = [
                                  ...receta.usuarios_id_favourite,
                                  getStorageUser().usuarioId,
                                ];
                              }

                              const updatedFavouriteInfo = favouriteInfo.map(
                                (item) =>
                                  item.idReceta === card?._id
                                    ? {
                                        ...item,
                                        usuarios_id_favourite:
                                          updatedUsuariosIdFavourite,
                                      }
                                    : item
                              );

                              setFavouriteInfo(updatedFavouriteInfo);
                            }}
                            sx={{
                              transition: "color 0.3s",
                              padding: 0,
                              width: "40px",
                            }}
                          >
                            {idFavourites?.includes(card._id) ? (
                              <BookmarkIcon
                                fontSize="large"
                                sx={{ color: "yellow" }}
                              />
                            ) : (
                              <BookmarkBorderIcon fontSize="large" />
                            )}
                          </IconButton>
                          <p style={{ margin: 0, textAlign: "left" }}>
                            {
                              favouriteInfo?.filter(
                                (value) => value.idReceta === card._id
                              )[0]?.usuarios_id_favourite.length
                            }
                          </p>
                          <IconButton
                            onClick={() => {
                              saveUpdateReactionReceta({
                                data: {
                                  idReceta: card?._id,
                                  idUser: getStorageUser().usuarioId,
                                  estado: !reactionInfo
                                    .find(
                                      (value) => value.idReceta === card?._id
                                    )
                                    .usuarios_id_reaction.some(
                                      (value) =>
                                        value === getStorageUser().usuarioId
                                    ),
                                  type: TypeNotification.LikeToReceta,
                                },
                              });
                              const receta = reactionInfo.find(
                                (value) => value.idReceta === card?._id
                              );

                              const userExists =
                                receta.usuarios_id_reaction.some(
                                  (value) =>
                                    value === getStorageUser().usuarioId
                                );

                              let updatedUsuariosIdReaction;

                              if (userExists) {
                                updatedUsuariosIdReaction =
                                  receta.usuarios_id_reaction.filter(
                                    (value) =>
                                      value !== getStorageUser().usuarioId
                                  );
                              } else {
                                updatedUsuariosIdReaction = [
                                  ...receta.usuarios_id_reaction,
                                  getStorageUser().usuarioId,
                                ];
                              }

                              const updatedReactionInfo = reactionInfo.map(
                                (item) =>
                                  item.idReceta === card?._id
                                    ? {
                                        ...item,
                                        usuarios_id_reaction:
                                          updatedUsuariosIdReaction,
                                      }
                                    : item
                              );

                              setReactionInfo(updatedReactionInfo);
                            }}
                            sx={{ width: "40px" }}
                          >
                            <FavoriteIcon
                              sx={{
                                color: reactionInfo
                                  ?.filter(
                                    (value) => value.idReceta === card?._id
                                  )[0]
                                  ?.usuarios_id_reaction.some(
                                    (value) =>
                                      value == getStorageUser().usuarioId
                                  )
                                  ? "red"
                                  : "gray",
                                transition: "color 0.5s",
                              }}
                            />
                          </IconButton>
                          <span>
                            {
                              reactionInfo?.filter(
                                (value) => value.idReceta === card?._id
                              )[0]?.usuarios_id_reaction.length
                            }
                          </span>
                          <IconButton
                            onClick={() => {
                              setIdReceta(card?._id);
                              window.history.replaceState(
                                "",
                                "",
                                `/main/p/${card._id}`
                              );
                              setOpenReceta(true);
                            }}
                            sx={{ width: "40px" }}
                          >
                            <CommentIcon
                              sx={{ color: "blue", width: "30px" }}
                            />
                          </IconButton>
                          <p style={{ margin: 0, textAlign: "left" }}>
                            {card?.comments.length}
                          </p>
                        </div>
                        <div
                          style={{
                            position: "absolute",
                            top: "100%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            zIndex: 1, // Para asegurar que el Fab esté sobre los demás elementos
                          }}
                        >
                          <Fab
                            aria-label="add"
                            onClick={() => {
                              handleClickExpand(card?._id);
                            }}
                            sx={{
                              height: "30px",
                              width: "30px",
                              minHeight: "unset",
                              color: "black",
                              boxShadow: "unset",
                              backgroundColor: "white",
                            }}
                          >
                            {isExpanded[card?._id] ? (
                              <RemoveCircleIcon />
                            ) : (
                              <AddIcon />
                            )}
                          </Fab>
                        </div>
                      </Box>
                      <Box
                        sx={{
                          width: "100%",
                          height: isExpanded[card._id] ? "100%" : "50%",
                          transition: "ease-in-out 0.5s",
                          backgroundColor: "white", // Fondo blanco
                          borderRadius: "0px 0px 8px 8px",
                          overflow: isExpanded[card._id] ? "auto" : "none",
                          scrollbarWidth: "thin",
                          clipPath: "border-box",
                          position: "relative",
                        }}
                      >
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex", // Usar flexbox para centrar el contenido
                            flexDirection: "column",
                            justifyContent: "center",
                          }}
                        >
                          <ul
                            style={{
                              height: "100%",
                              padding: "0px 10px 0px 10px",
                              margin: 0,
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <h3>{card?.titulo}</h3>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                height: "15px",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <AccessTimeIcon />
                                <p>
                                  {card?.hours > 0
                                    ? card?.hours + "h " + card?.minutes + "m"
                                    : card?.minutes + "M"}
                                </p>
                              </div>
                              <p>{dateConvert(card?.fechaReceta)}</p>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <PersonIcon />
                                <p>{card?.cantidadPersonas}</p>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <AssignmentIcon />
                                <p>{card?.dificultad[0].nombreDificultad}</p>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <RestaurantIcon />
                                <p>{card?.categoria[0].nombreCategoria}</p>
                              </div>
                            </div>

                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              {card?.subCategoria
                                ?.slice()
                                .sort((a, b) =>
                                  a.nombreSubCategoria.localeCompare(
                                    b.nombreSubCategoria
                                  )
                                )
                                .map((value) =>
                                  IconSvg(value.nombreSubCategoria)
                                )}
                            </div>

                            <p>{dateConvert(card?.fechaReceta)}</p>
                            <p>{card?.descripcion}</p>

                            <h3>INGREDIENTS</h3>
                            {card?.grupoIngrediente?.map((value) => (
                              <div key={value.nombreGrupo}>
                                <h4>{value.nombreGrupo}</h4>
                                {value.item.map((value2, index) => (
                                  <p>{`${value2.valor} ${
                                    value2.medida.nombreMedida == "Quantity"
                                      ? ""
                                      : value2.medida.nombreMedida
                                  } ${
                                    value2.ingrediente.nombreIngrediente
                                  }`}</p>
                                ))}
                              </div>
                            ))}
                          </ul>
                        </div>
                      </Box>
                    </Box>
                  </Zoom>
                );
              })}
            {loadingNearScreen ? <SkeletonWave /> : <></>}
            {recetasInfo?.length == 0 ? <h4>Not Recetas Founded</h4> : <></>}
            {reactionInfo?.length > 8 ? (
              <div id="visor" ref={externalRef}></div>
            ) : (
              <></>
            )}
          </>
        )}
      </Box>
      {openReceta ? (
        <Modal
          open={openReceta}
          closeAfterTransition
          BackdropProps={{
            timeout: 500,
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <DetailsReceta
            isFull={false}
            isFromProfile={false}
            origen={"discoveryRecipes"}
            idReceta={idReceta}
            setOpen={setOpenReceta}
            idUser={idUser}
          />
        </Modal>
      ) : (
        <></>
      )}
    </Box>
  );
};
