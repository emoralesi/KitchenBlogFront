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
import { DetailsReceta } from "../Others/DitailsReceta";
import { getCloudinaryUrl } from "../../../utils/GetCloudinaryUrl";

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
  const {
    getIdUserByUserName,
    ObtenerIdFavourites,
    SaveUpdateMyFavourites,
    idFavourites,
    setIdFavourites,
  } = useUsuario();
  const { ObtenerCategoria, categoriasAll } = useCategoria();
  const { ObtenerSubCategorias, subCategoriasAll } = useSubCategoria();
  const { ObtenerIngrediente, ingredientesAll } = useIngrediente();

  const [openReceta, setOpenReceta] = useState(false);
  const [idReceta, setIdReceta] = useState(null);
  const [idUser, setIdUser] = useState(null);
  const [isExpanded, setIsExpanded] = useState({});
  const [textSearch, setTextSearch] = useState("");
  const [errorSearch, setErrorSearch] = useState(false);
  const [filterSearch, setFilterSearch] = useState(null);
  const [previousLength, setPreviousLength] = useState(0);
  const [categoria, setCategoria] = useState("");
  const [subCategoria, setSubCategoria] = useState([]);
  const [ingredientes, setIngredientes] = useState([]);
  const [searchState, setSearchState] = useState(false);

  const [filterBy, setFilterBy] = useState({
    categoria: "",
    subCategoria: "",
    ingredientes: [],
  });
  const [orderBy, setOrderBy] = useState({
    orderBy: "relevante",
    direction: "desc",
  });
  const [loadingNearScreen, setLoadingNearScreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [firstLoading, setFirstLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9);

  const GetAllRecipes = async () => {
    setLoading(true);
    await ObtenerRecetasInfo({ data: { page, limit, orderBy } })
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
        setFirstLoading(false);
      });
  };

  const handleToggleSubCategoria = (categoryId) => {
    if (subCategoria.includes(categoryId)) {
      setSubCategoria(subCategoria.filter((id) => id !== categoryId));
    } else {
      setSubCategoria([...subCategoria, categoryId]);
    }
  };

  const orderOptions = [
    {
      label: "Relevante ↑",
      value: { orderBy: "relevante", direction: "asc" },
    },
    {
      label: "Relevante ↓",
      value: { orderBy: "relevante", direction: "desc" },
    },
    {
      label: "Like ↑",
      value: { orderBy: "cantidadLike", direction: "asc" },
    },
    {
      label: "Like ↓",
      value: { orderBy: "cantidadLike", direction: "desc" },
    },
    {
      label: "Comentarios ↑",
      value: { orderBy: "cantidadComentarios", direction: "asc" },
    },
    {
      label: "Comnetarios ↓",
      value: { orderBy: "cantidadComentarios", direction: "desc" },
    },
    {
      label: "Guardados ↑",
      value: { orderBy: "cantidadGuardados", direction: "asc" },
    },
    {
      label: "Guardados ↓",
      value: { orderBy: "cantidadGuardados", direction: "desc" },
    },
  ];

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
            orderBy,
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
        orderBy,
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
                            orderBy,
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
                <Grid item xs={12} sx={{ height: "20px" }}>
                  {filterSearch && (
                    <Typography variant="subtitle2" color="textSecondary">
                      Buscando por: <strong>{filterSearch}</strong>
                    </Typography>
                  )}
                </Grid>

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
                              orderBy,
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
                          setLimit(9);
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
                          orderBy,
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
          <Box
            mx="auto"
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <FormControl
              fullWidth
              size="small"
              className="min-w-[120px] bg-white rounded-xl shadow-sm"
              sx={{
                width: { lg: "20%", md: "25%", xs: "40%" },
                marginBottom: "5px",
              }}
            >
              <InputLabel id="orderby-label">Ordenar</InputLabel>
              <Select
                labelId="orderby-label"
                value={`${orderBy.orderBy}_${orderBy.direction}`}
                label="Ordenar"
                onChange={(event) => {
                  const [orderByField, direction] =
                    event.target.value.split("_");
                  setOrderBy({ orderBy: orderByField, direction });
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
                      orderBy: { orderBy: orderByField, direction },
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
              >
                {orderOptions.map((option) => (
                  <MenuItem
                    key={`${option.value.orderBy}_${option.value.direction}`}
                    value={`${option.value.orderBy}_${option.value.direction}`}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
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
                      <p>SIN SELECCIONAR</p>
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
                  <InputLabel>Ingredientes</InputLabel>
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
                        orderBy,
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
      {recetasInfo?.length == 0 && firstLoading == false ? (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="50vh"
          width="auto"
          textAlign="center"
          px={2}
        >
          <Typography variant="h5" color="textSecondary" gutterBottom>
            No se encontraron recetas. <SearchIcon fontSize="large" />
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Cambia el filtro de busqueda para encontrar recetas.
          </Typography>
        </Box>
      ) : (
        <></>
      )}
      <Box
        sx={{
          display: "grid",
          gap: "15px",
          marginLeft: "10px",
          marginRight: "10px",
          marginBottom: "10px",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          },
        }}
      >
        {loading ? (
          <SkeletonWave />
        ) : (
          <>
            {[...recetasInfo]?.map((card, index) => {
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
                      borderRadius: 2,
                      boxShadow: 3,
                      overflow: "hidden",
                      display: "flex",
                      maxHeight: "70vh",
                      flexDirection: "column",
                      bgcolor: "background.paper",
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
                          px: 1,
                          py: 1,
                          display: "flex",
                          justifyContent: "space-around",
                          alignItems: "center",
                          borderTop: "1px solid #eee",
                          bgcolor: "background.default",
                          height: isExpanded[card._id] ? "0%" : "10%",
                          transition: "ease-in-out 0.5s",
                        }}
                      >
                        <Box textAlign="center">
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
                          <Typography variant="caption">
                            {
                              favouriteInfo?.find(
                                (value) => value.idReceta == card._id
                              )?.usuarios_id_favourite.length
                            }
                          </Typography>
                        </Box>
                        <Box textAlign="center">
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
                          <Typography variant="caption">
                            {
                              reactionInfo.find(
                                (value) => value.idReceta === card?._id
                              ).usuarios_id_reaction.length
                            }
                          </Typography>
                        </Box>
                        <Box textAlign="center">
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
                          <Typography variant="caption">
                            {card?.comments.length}
                          </Typography>
                        </Box>
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
                          p: 0,
                          width: "100%",
                          height: 200,
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
                          src={getCloudinaryUrl(card.images[0], { width: 400 })}
                          alt="Imagen"
                          loading="lazy"
                          decoding="async"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                        <Box
                          className="overlay"
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            backgroundColor: "rgba(0, 0, 0, 0)",
                            transition: "background-color 0.3s ease",
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
                            opacity: 0,
                            transition: "opacity 0.3s ease",
                            fontWeight: "bold",
                          }}
                        >
                          Ver Más
                        </Typography>
                      </Button>
                      <Fab
                        aria-label="add"
                        onClick={() => {
                          handleClickExpand(card?._id);
                        }}
                        sx={{
                          position: "absolute",
                          bottom: -16,
                          left: "50%",
                          transform: "translateX(-50%)",
                          height: 30,
                          width: 30,
                          minHeight: "unset",
                          backgroundColor: "white",
                          color: "black",
                          boxShadow: 1,
                        }}
                      >
                        {isExpanded[card?._id] ? (
                          <RemoveCircleIcon />
                        ) : (
                          <AddIcon />
                        )}
                      </Fab>
                    </Box>
                    <Box
                      sx={{
                        px: 2,
                        paddingTop: "10px",
                        pb: 2,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        height: isExpanded[card._id] ? "100%" : "60%",
                        transition: "ease-in-out 0.5s",
                        backgroundColor: "white",
                        overflow: isExpanded[card._id] ? "auto" : "none",
                        scrollbarWidth: "thin",
                        clipPath: "border-box",
                      }}
                    >
                      <Box
                        sx={{
                          height: isExpanded[card._id] ? 0 : "20%",
                          opacity: isExpanded[card._id] ? 0 : 1,
                          transition: "height 0.5s ease, opacity 0.5s ease",
                          alignItems: "center",
                          justifyContent: "space-between",
                          display: "flex",
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Button
                            onClick={() => {
                              navigate(
                                `/main/profile/${card.user[0].username}`
                              );
                            }}
                          >
                            <Avatar
                              sx={{
                                width: 50,
                                height: 50,
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
                      </Box>
                      <Typography variant="h6" fontWeight="bold">
                        {card.titulo}
                      </Typography>

                      <Box display="flex" justifyContent="space-between">
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <AccessTimeIcon fontSize="small" />
                          <Typography variant="body2">
                            {card.hours > 0
                              ? `${card.hours}h ${card.minutes}m`
                              : `${card.minutes}m`}
                          </Typography>
                        </Box>
                        <Typography variant="body2">
                          {dateConvert(card.fechaReceta)}
                        </Typography>
                      </Box>

                      <Box
                        display="flex"
                        justifyContent="space-between"
                        flexWrap="wrap"
                      >
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <PersonIcon fontSize="small" />
                          <Typography variant="body2">
                            {card.cantidadPersonas}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <AssignmentIcon fontSize="small" />
                          <Typography variant="body2">
                            {card.dificultad[0].nombreDificultad}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <RestaurantIcon fontSize="small" />
                          <Typography variant="body2">
                            {card.categoria[0].nombreCategoria}
                          </Typography>
                        </Box>
                      </Box>

                      <Box display="flex" flexWrap="wrap" gap={1}>
                        {card.subCategoria
                          .slice()
                          .sort((a, b) =>
                            a.nombreSubCategoria.localeCompare(
                              b.nombreSubCategoria
                            )
                          )
                          .map((value) => IconSvg(value.nombreSubCategoria))}
                      </Box>

                      <Typography variant="body2" color="text.secondary">
                        {card.descripcion}
                      </Typography>

                      {isExpanded[card._id] && (
                        <>
                          <Typography variant="subtitle2" fontWeight="bold">
                            INGREDIENTES
                          </Typography>
                          {card.grupoIngrediente.map((grupo) => (
                            <Box key={grupo.nombreGrupo} mt={1}>
                              <Typography variant="body2" fontWeight="bold">
                                {grupo.nombreGrupo}
                              </Typography>
                              {grupo.item.map((item, idx) => {
                                const tienePresentacion =
                                  item.presentacion?.nombrePresentacion;
                                const textoPresentacion = tienePresentacion
                                  ? ` (${tienePresentacion})`
                                  : "";

                                const alternativas = item.alternativas?.length
                                  ? item.alternativas
                                      .map(
                                        (alt) => ` / ${alt.nombreIngrediente}`
                                      )
                                      .join("")
                                  : "";

                                return (
                                  <Typography key={idx} variant="body2">
                                    {`${item.valor} ${
                                      item.medida.nombreMedida === "Cantidad"
                                        ? ""
                                        : item.medida.nombreMedida
                                    } ${
                                      item.ingrediente.nombreIngrediente
                                    }${textoPresentacion}${alternativas}`}
                                  </Typography>
                                );
                              })}
                            </Box>
                          ))}
                        </>
                      )}
                    </Box>
                  </Box>
                </Zoom>
              );
            })}
            {loadingNearScreen ? <SkeletonWave /> : <></>}
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
