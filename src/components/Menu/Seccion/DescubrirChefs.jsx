import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import debounce from "just-debounce-it";
import { useCallback, useEffect, useRef, useState } from "react";
import useNearScreen from "../../../Hooks/useNearScreen";
import { useUsuario } from "../../../Hooks/useUsuario";
import { CardUserSkeleton } from "../../../utils/SkeletonCardUser";
import { getStorageUser } from "../../../utils/StorageUser";
import { CardUser } from "./CardUser";

export const DescubrirChefs = () => {
  const {
    ObtenerUsuariosDescubrir,
    usuariosDescubrir,
    totalUsuariosDescubrir,
  } = useUsuario();
  const [showClearIcon, setShowClearIcon] = useState("none");
  const [textSearch, setTextSearch] = useState("");
  const [errorSearch, setErrorSearch] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9);
  const [filterSearch, setFilterSearch] = useState(null);
  const [searchState, setSearchState] = useState(false);
  const [loadingFirst, setLoadingFirst] = useState(false);
  const [loadingNearScreen, setLoadingNearScreen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderBy, setOrderBy] = useState({
    orderBy: "relevante",
    direction: "desc",
  });

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
      label: "Recetas ↑",
      value: { orderBy: "cantidadRecetas", direction: "asc" },
    },
    {
      label: "Recetas ↓",
      value: { orderBy: "cantidadRecetas", direction: "desc" },
    },
  ];

  const handleChange = (event) => {
    setTextSearch(event.target.value);
    setShowClearIcon(event.target.value === "" ? "none" : "flex");
  };

  function SearchAction() {
    setLoading(true);
    if (textSearch.length < 3) {
      setErrorSearch(true);
      setLoading(false);
      return;
    } else {
      if (errorSearch) {
        setErrorSearch(false);
      }
      setFilterSearch(textSearch);
      ObtenerUsuariosDescubrir({
        body: {
          userId: getStorageUser().usuarioId,
          username: textSearch,
          orderBy,
          page,
          limit,
        },
      }).finally(() => {
        setLoading(false);
      });
      setSearchState(true);
      setLimit(9);
    }
  }

  const externalRef = useRef();
  const { isNearScreen } = useNearScreen({
    externalRef: usuariosDescubrir?.length == 0 ? null : externalRef,
    once: false,
  });

  const debounceHandleNextPage = useCallback(
    debounce(async () => {
      if (usuariosDescubrir.length < totalUsuariosDescubrir) {
        setLoadingNearScreen(true);
        const newLimit = limit + 9;
        setLimit(newLimit);
        await ObtenerUsuariosDescubrir({
          body: {
            userId: getStorageUser().usuarioId,
            username: textSearch,
            orderBy,
            page,
            limit: newLimit,
          },
        }).finally(() => {
          setLoadingNearScreen(false);
        });
      }
    }, 250),
    [usuariosDescubrir]
  );

  useEffect(
    function () {
      if (isNearScreen) {
        debounceHandleNextPage();
      }
    },
    [isNearScreen]
  );

  useEffect(() => {
    setLoadingFirst(true);
    ObtenerUsuariosDescubrir({
      body: { userId: getStorageUser().usuarioId, orderBy, page, limit },
    }).finally(() => {
      setLoadingFirst(false);
    });
  }, []);

  return (
    <Box
      px={{ xs: 2, md: 5 }}
      sx={{
        padding: "0px 0px 0px 0px !important",
        marginLeft: "10px",
        marginRight: "10px",
        marginTop: "10px",
        marginBottom: "10px",
      }}
    >
      <Box mb={4} textAlign="center">
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Descubre Chefs Talentosos
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Explora nuevos talentos culinarios registrados en la plataforma
        </Typography>
        <Divider
          sx={{ mt: 2, width: "60%", mx: "auto", marginBottom: "10px" }}
        />
        <Grid
          container
          spacing={2}
          alignItems="center"
          sx={{ marginBottom: "10px" }}
        >
          <Grid item xs={12} md={8}>
            <FormControl fullWidth>
              <TextField
                size="small"
                variant="outlined"
                error={errorSearch}
                helperText={
                  errorSearch ? "Escribe al menos 3 caracteres..." : null
                }
                placeholder="Escribe al menos 3 caracteres..."
                onChange={handleChange}
                value={textSearch}
                onKeyDown={debounce((ev) => {
                  if (ev.key === "Enter") {
                    SearchAction();
                  }
                }, 800)}
                InputProps={{
                  startAdornment: (
                    <IconButton
                      onClick={() => {
                        if (textSearch.length < 3) {
                          setErrorSearch(true);
                        } else {
                          if (errorSearch) setErrorSearch(false);
                          SearchAction();
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
                      onClick={() => {
                        setTextSearch("");
                        setShowClearIcon("none");
                        setErrorSearch(false);
                      }}
                    >
                      <ClearIcon />
                    </IconButton>
                  ),
                }}
              />
            </FormControl>
            <Box sx={{ height: "20px" }}>
              {filterSearch && (
                <Typography variant="subtitle2" color="textSecondary">
                  Buscando por: <strong>{filterSearch}</strong>
                </Typography>
              )}
            </Box>
          </Grid>

          <Grid
            item
            xs={12}
            md={4}
            container
            spacing={1}
            justifyContent="flex-end"
            direction="column"
          >
            <Grid item>
              <Button
                variant="contained"
                onClick={() => {
                  if (textSearch.length < 3) {
                    setErrorSearch(true);
                  } else {
                    if (errorSearch) setErrorSearch(false);
                    SearchAction();
                  }
                }}
                fullWidth
              >
                BUSCAR
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                disabled={!searchState}
                onClick={async () => {
                  setLoading(true);
                  await ObtenerUsuariosDescubrir({
                    body: {
                      userId: getStorageUser().usuarioId,
                      orderBy,
                      page,
                      limit,
                    },
                  });
                  setSearchState(false);
                  setFilterSearch(null);
                  setLoading(false);
                }}
                fullWidth
              >
                RESETEAR
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Box
          mx="auto"
          sx={{ width: "100%", display: "flex", justifyContent: "flex-start" }}
        >
          <FormControl
            fullWidth
            size="small"
            className="min-w-[120px] bg-white rounded-xl shadow-sm"
            sx={{ width: { lg: "20%", md: "25%", xs: "40%" } }}
          >
            <InputLabel id="orderby-label">Ordenar</InputLabel>
            <Select
              labelId="orderby-label"
              value={`${orderBy.orderBy}_${orderBy.direction}`}
              label="Ordenar"
              onChange={(event) => {
                const [orderByField, direction] = event.target.value.split("_");
                setOrderBy({ orderBy: orderByField, direction });
                setLoading(true);
                ObtenerUsuariosDescubrir({
                  body: {
                    userId: getStorageUser().usuarioId,
                    orderBy: { orderBy: orderByField, direction },
                    username: filterSearch || "",
                  },
                }).finally(() => setLoading(false));
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
      </Box>

      {loadingFirst ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : null}

      {!loading &&
        !loadingFirst &&
        (!usuariosDescubrir || usuariosDescubrir.length === 0) && (
          <Box mt={4} textAlign="center">
            <Typography variant="h6" color="text.secondary">
              No se encontraron chefs que coincidan con la búsqueda.
            </Typography>
          </Box>
        )}

      <Box
        display="grid"
        gap={3}
        gridTemplateColumns={{
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
        }}
      >
        {loading
          ? [...Array(3)].map((_, i) => <CardUserSkeleton key={i} />)
          : usuariosDescubrir?.map((user) => (
              <CardUser key={user.id || user.usuarioId} user={user} />
            ))}
        {loadingNearScreen ? (
          [...Array(6)].map((_, index) => <CardUserSkeleton key={index} />)
        ) : (
          <></>
        )}
        {totalUsuariosDescubrir > 8 && !loading ? (
          <div id="visor" ref={externalRef}></div>
        ) : (
          <></>
        )}
      </Box>
    </Box>
  );
};
