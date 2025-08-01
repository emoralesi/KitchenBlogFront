import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  ImageList,
  ImageListItem,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Slide,
  styled,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useCategoria } from "../../../Hooks/useCategoria";
import { useDificultad } from "../../../Hooks/useDificultad";
import { useIngrediente } from "../../../Hooks/useIngrediente";
import { useMedida } from "../../../Hooks/useMedida";
import { useReceta } from "../../../Hooks/useReceta";
import { useUtencilios } from "../../../Hooks/useUtencilios";
import { getStorageUser } from "../../../utils/StorageUser";
import { useSubCategoria } from "../../../Hooks/useSubCategoria";
import { usePresentacion } from "../../../Hooks/usePresentacion";
import { getCloudinaryUrl } from "../../../utils/GetCloudinaryUrl";
import { enqueueSnackbar } from "notistack";
import { saveIngrediente } from "../../../services/IngredienteService";
import { HelpOutline } from "@mui/icons-material";

export const UpdateRecetaForm = ({
  open,
  setOpen,
  getUserAndReceta,
  recetaId,
  page,
  limit,
  setReactionInfo,
  setFavouriteInfo,
}) => {
  const { getDetailsReceta, detailsReceta, actualizarReceta } = useReceta();
  const { ObtenerCategoria, categoriasAll } = useCategoria();
  const { ObtenerSubCategorias, subCategoriasAll } = useSubCategoria();
  const { ObtenerIngrediente, ingredientesAll } = useIngrediente();
  const { ObtenerDificultad, dificultadesAll } = useDificultad();
  const { ObtenerPresentacion, presentacionesAll } = usePresentacion();
  const { ObtenerMedida, medidasAll } = useMedida();
  const { ObtenerUntencilios, utenciliosAll } = useUtencilios();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [cantidadPersonas, setCantidadPersonas] = useState(0);
  const [dificultad, setDificultad] = useState("");
  const [categoria, setCategoria] = useState("");
  const [utencilio, setUtencilio] = useState([]);
  const [subCategoria, setSubCategoria] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState([]);
  const [imagesRecipe, setImagesRecipe] = useState([]);

  const [loadingNewIngrediente, setLoadingNewIngrediente] = useState(false);
  const [openModalIngrediente, setOpenModalIngrediente] = useState(false);
  const [nuevoIngredienteNombre, setNuevoIngredienteNombre] = useState("");
  const [pasos, setPasos] = useState([
    { pasoNumero: 1, descripcion: "", images: [] },
  ]);
  const [grupoIngrediente, setGrupoIngrediente] = useState([
    {
      nombreGrupo: "",
      items: [
        {
          valor: 0,
          idIngrediente: "",
          idMedida: "",
          idPresentacion: "",
          alternativas: [],
        },
      ],
    },
  ]);

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const handleClose = () => setOpen(false);

  const convertirDatos = (data) => {
    return data.grupoIngrediente.map((grupo) => ({
      nombreGrupo: grupo.nombreGrupo,
      _id: grupo._id,
      items: grupo.item.map((item) => ({
        _id: item._id,
        valor: item.valor,
        idIngrediente: item.ingrediente._id,
        idMedida: item.medida._id,
        idPresentacion: item?.presentacion?._id,
        alternativas: item?.alternativas?.map((alt) => ({
          idIngrediente: alt._id,
        })),
      })),
    }));
  };

  const handleAddAlternativa = (groupIndex, itemIndex) => {
    const newGroups = [...grupoIngrediente];
    newGroups[groupIndex].items[itemIndex].alternativas.push({
      idIngrediente: "",
    });
    setGrupoIngrediente(newGroups);
  };

  const handleDeleteAlternativa = (groupIndex, itemIndex, altIndex) => {
    const newGroups = [...grupoIngrediente];
    newGroups[groupIndex].items[itemIndex].alternativas.splice(altIndex, 1);
    setGrupoIngrediente(newGroups);
  };

  const handleDeleteImage = (index) => {
    setImagesRecipe((prevImages) => prevImages.filter((_, i) => i !== index));
    setImageUrl((prevUrls) => prevUrls.filter((_, i) => i !== index));
  };

  const handleAddGrupoIngrediente = () => {
    setGrupoIngrediente([
      ...grupoIngrediente,
      {
        nombreGrupo: "",
        items: [
          {
            valor: 0,
            idIngrediente: "",
            idMedida: "",
            idPresentacion: "",
            alternativas: [],
          },
        ],
      },
    ]);
  };

  const handleDeleteGrupoIngrediente = (index) => {
    if (grupoIngrediente.length > 1) {
      const newGroups = [...grupoIngrediente];
      newGroups.splice(index, 1);
      setGrupoIngrediente(newGroups);
    }
  };

  const handleAddItem = (groupIndex) => {
    const newGroups = [...grupoIngrediente];
    newGroups[groupIndex].items.push({
      valor: 0,
      idIngrediente: "",
      idMedida: "",
    });
    setGrupoIngrediente(newGroups);
  };

  function startsWithCloudinary(url) {
    return url.startsWith("http://res.cloudinary.com");
  }

  const transformCloudinaryUrl = (url, width, height) => {
    if (startsWithCloudinary(url)) {
      return url.replace(
        "/upload/",
        `/upload/w_${width},h_${height},c_fill,q_auto,f_auto/`
      );
    } else {
      return url;
    }
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length > 3) {
      alert("Puedes subir un máximo de 3 imágenes");
      return prevImages;
    }

    setImagesRecipe((prevImages) => {
      const newImages = [...prevImages, ...selectedFiles];
      return newImages;
    });

    setImageUrl((prevUrls) => {
      const newUrls = selectedFiles.map((file) => URL.createObjectURL(file));
      return [...prevUrls, ...newUrls];
    });
  };

  const handleDeleteItem = (groupIndex, itemIndex) => {
    const newGroups = [...grupoIngrediente];
    if (newGroups[groupIndex].items.length > 1) {
      newGroups[groupIndex].items.splice(itemIndex, 1);
      setGrupoIngrediente(newGroups);
    }
  };

  const handleAddPaso = () => {
    setPasos([
      ...pasos,
      { pasoNumero: pasos.length + 1, descripcion: "", images: [] },
    ]);
  };

  const handleDeletePaso = (index) => {
    if (pasos.length > 1) {
      const newPasos = [...pasos];
      newPasos.splice(index, 1);
      setPasos(newPasos);
    }
  };

  const handleToggleSubCategoria = (categoryId) => {
    if (subCategoria.includes(categoryId)) {
      setSubCategoria(subCategoria.filter((id) => id !== categoryId));
    } else {
      setSubCategoria([...subCategoria, categoryId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      _id: recetaId,
      titulo: title,
      descripcion: description,
      hours,
      minutes,
      cantidadPersonas,
      dificultad,
      categoria,
      grupoIngrediente,
      utencilio,
      subCategoria,
      pasos,
      imagesRecipe,
      user: getStorageUser().usuarioId,
    };

    if (!title.trim()) {
      alert("El título es obligatorio.");
      return;
    }

    function capitalizarTitulo(titulo) {
      if (!titulo || titulo.length === 0) {
        return titulo;
      }

      const palabras = titulo.split(" ");

      const palabrasCapitalizadas = palabras.map((palabra) => {
        return palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase();
      });

      return palabrasCapitalizadas.join(" ");
    }

    data.titulo = capitalizarTitulo(data.titulo);

    if (!description.trim()) {
      alert("La descripcion es obligatorio.");
      return;
    }

    if (!(cantidadPersonas > 0)) {
      alert("La cantidad de personas debe ser mayor a 0 ");
      return;
    }

    if (!dificultad.trim()) {
      alert("La dificultad es obligatoria.");
      return;
    }

    if (!categoria.trim()) {
      alert("La categoria es obligatoria.");
      return;
    }

    if (imagesRecipe.length < 1) {
      alert("Debes subir al menos 1 imagen");
      return;
    }

    if (imagesRecipe.length < 1) {
      alert("Debes subir al menos 1 imagen");
      return;
    }

    if (imagesRecipe.length > 5) {
      alert("Puedes subir un máximo de 5 imágenes");
      return;
    }

    let ingredientesValidos = true;
    let alternativasValidas = true;

    for (const grupo of grupoIngrediente) {
      if (grupo.items.length === 0) {
        ingredientesValidos = false;
        break;
      }

      for (const item of grupo.items) {
        if (!(item.valor !== "") || !item.idIngrediente || !item.idMedida) {
          ingredientesValidos = false;
          break;
        }
        if (item.alternativas.length > 0) {
          for (const alternativa of item.alternativas) {
            if (!alternativa.idIngrediente) {
              alternativasValidas = false;
              break;
            }
          }
        }
      }
      if (!ingredientesValidos) break;
    }

    if (!alternativasValidas) {
      alert(
        "Si agrega un Ingrediente Alternativo debe seleccionar uno, de lo contrario elimine el Ingrediente Alternativo."
      );
      return;
    }

    if (!ingredientesValidos) {
      alert(
        "Cada grupo de ingredientes debe tener al menos un ingrediente con valor mayor a 0, y tanto el ID del ingrediente como la medida deben estar seleccionados."
      );
      return;
    }

    if (pasos.length === 0) {
      alert("La receta debe tener al menos un paso.");
      return;
    }

    for (const paso of pasos) {
      if (!paso.descripcion.trim()) {
        alert("La descripción de cada paso es obligatoria.");
        return;
      }
    }

    if (grupoIngrediente.length > 1) {
      for (const grupo of grupoIngrediente) {
        if (!grupo.nombreGrupo.trim()) {
          ingredientesValidos = false;
          break;
        }
      }
    }

    if (!ingredientesValidos) {
      alert("Si hay más de un grupo, todos deben tener un nombre.");
      return;
    }
    setLoading(true);
    try {
      const result = await actualizarReceta({ data: data });
      if (result?.status === "ok") {
        await getUserAndReceta({
          data: { userId: getStorageUser().usuarioId, page, limit },
        });
        handleClose();
      }
    } catch (error) {
      setLoading(false);
    }
    setLoading(false);
  };

  const handleOpenModalIngrediente = () => setOpenModalIngrediente(true);

  const handleCloseModalIngrediente = () => {
    setOpenModalIngrediente(false);
    setNuevoIngredienteNombre("");
  };

  const handleCrearIngrediente = async () => {
    if (nuevoIngredienteNombre) {
      setLoadingNewIngrediente(true);
      try {
        const nombreFormateado = nuevoIngredienteNombre
          .trim()
          .replace(/\s+/g, " ")
          .toLowerCase()
          .replace(/^\w/, (c) => c.toUpperCase());

        const result = await saveIngrediente({
          nuevoIngrediente: nombreFormateado,
        });

        if (result?.status === "ok") {
          await ObtenerIngrediente();
          setNuevoIngredienteNombre("");
          handleCloseModalIngrediente();
          enqueueSnackbar("Ingrediente creado correctamente", {
            variant: "success",
          });
        } else if (result?.status === "warning") {
          enqueueSnackbar(result?.message, {
            variant: "warning",
          });
        } else {
          enqueueSnackbar("Error al crear el ingrediente", {
            variant: "error",
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingNewIngrediente(false);
      }
    } else {
      enqueueSnackbar("Debe rellenar el campo", { variant: "warning" });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await ObtenerCategoria();
      await ObtenerSubCategorias();
      await ObtenerIngrediente();
      await ObtenerDificultad();
      await ObtenerMedida();
      await ObtenerUntencilios();
      await ObtenerPresentacion();

      const data = await getDetailsReceta({ recetaId });

      const datosConvertidos = convertirDatos(data);

      setGrupoIngrediente(datosConvertidos);
      setTitle(data.titulo);
      setDescription(data.descripcion);
      setHours(data.hours);
      setMinutes(data.minutes);
      setCantidadPersonas(data.cantidadPersonas);
      setDificultad(data.dificultad);
      setCategoria(data.categoria);
      setUtencilio(data.utencilio);
      setImagesRecipe(data.images);
      setImageUrl(data.images);
      setSubCategoria(data.subCategoria);
      setPasos(data.pasos);
      setLoading(false);
    };

    fetchData();
  }, [recetaId]);

  return (
    <>
      <Modal
        open={open}
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
        <Slide direction="up" in={open}>
          <Box
            sx={{
              width: { xs: "85vw", md: "90vw", lg: "90vw" },
              height: { xs: "85vh", md: "85vh", lg: "90vh" },
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                width: "100%",
                height: "100%",
              }}
            >
              <Button
                onClick={handleClose}
                size="small"
                sx={{ alignSelf: "flex-end", height: "30px" }}
              >
                X
              </Button>
              <div style={{ overflow: "auto", width: "100%", height: "100%" }}>
                <form onSubmit={handleSubmit}>
                  <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                  >
                    Subir Imagenes
                    <VisuallyHiddenInput
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      multiple
                    />
                  </Button>
                  <ImageList
                    sx={{ width: "100%", height: "auto", alignItems: "center" }}
                    cols={imageUrl.length}
                    gap={8}
                  >
                    {imageUrl.map((image, index) => (
                      <ImageListItem
                        key={index}
                        sx={{
                          justifyItems: "center",
                          width: "100%",
                          alignItems: "center",
                        }}
                      >
                        <div style={{ position: "relative", height: "220px" }}>
                          <img
                            src={getCloudinaryUrl(image, { width: 400 })}
                            alt={`Image ${index}`}
                            loading="lazy"
                            style={{
                              width: "200px",
                              height: "200px",
                              objectFit: "cover",
                              position: "relative",
                            }}
                          />
                          <IconButton
                            onClick={() => handleDeleteImage(index)}
                            sx={{
                              position: "absolute",
                              top: 8,
                              right: 8,
                              color: "white",
                              backgroundColor: "rgba(0, 0, 0, 0.5)",
                              "&:hover": {
                                backgroundColor: "rgba(0, 0, 0, 0.7)",
                              },
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </div>
                      </ImageListItem>
                    ))}
                  </ImageList>

                  <Box sx={{ position: "relative" }}>
                    <TextField
                      label="Titulo"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      fullWidth
                      margin="normal"
                      inputProps={{ maxLength: 50 }}
                    />
                    <Typography
                      sx={{
                        position: "absolute",
                        bottom: 8,
                        right: 8,
                      }}
                      variant="caption"
                      color="textSecondary"
                    >
                      {title.length}/{50}
                    </Typography>
                  </Box>
                  <Box sx={{ position: "relative" }}>
                    <TextField
                      label="Descripcion"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      multiline
                      rows={4}
                      fullWidth
                      margin="normal"
                      inputProps={{ maxLength: 500 }}
                    />
                    <Typography
                      sx={{
                        position: "absolute",
                        bottom: 8,
                        right: 8,
                      }}
                      variant="caption"
                      color="textSecondary"
                    >
                      {description.length}/{500}
                    </Typography>
                  </Box>
                  <TextField
                    label="Horas"
                    type="number"
                    value={hours}
                    onChange={(e) => setHours(parseInt(e.target.value))}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Minutos"
                    type="number"
                    value={minutes}
                    onChange={(e) => setMinutes(parseInt(e.target.value))}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Porciones"
                    type="number"
                    value={cantidadPersonas}
                    onChange={(e) =>
                      setCantidadPersonas(parseInt(e.target.value))
                    }
                    fullWidth
                    margin="normal"
                  />
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Dificultad</InputLabel>
                    <Select
                      value={dificultad}
                      onChange={(e) => setDificultad(e.target.value)}
                    >
                      {dificultadesAll?.map((dificulties) => (
                        <MenuItem key={dificulties._id} value={dificulties._id}>
                          {dificulties.nombreDificultad}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Categoria</InputLabel>
                    <Select
                      value={categoria}
                      onChange={(e) => setCategoria(e.target.value)}
                    >
                      {categoriasAll?.map((category) => (
                        <MenuItem key={category._id} value={category._id}>
                          {category.nombreCategoria}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth margin="normal">
                    <Autocomplete
                      multiple
                      options={utenciliosAll || []}
                      getOptionLabel={(option) => option.nombreUtencilio}
                      value={
                        utenciliosAll?.filter((u) =>
                          utencilio.includes(u._id)
                        ) || []
                      }
                      onChange={(e, newValues) => {
                        const ids = newValues.map((u) => u._id);
                        setUtencilio(ids);
                      }}
                      filterOptions={(options, state) => {
                        const input = state.inputValue.trim().toLowerCase();
                        return options.filter((option) =>
                          option.nombreUtencilio.toLowerCase().includes(input)
                        );
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Utencilios"
                          placeholder="Buscar..."
                        />
                      )}
                    />
                  </FormControl>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      marginBottom: 2,
                      overflow: "auto",
                    }}
                  >
                    {subCategoriasAll?.map((subCategory) => (
                      <Button
                        key={subCategory._id}
                        variant={
                          subCategoria.includes(subCategory._id)
                            ? "contained"
                            : "outlined"
                        }
                        onClick={() =>
                          handleToggleSubCategoria(subCategory._id)
                        }
                        sx={{
                          transition: "background-color 0.3s",
                          "&:hover": {
                            backgroundColor: subCategoria.includes(
                              subCategory._id
                            )
                              ? "rgba(0, 0, 0, 0.12)"
                              : "rgba(0, 0, 0, 0.04)",
                          },
                          minWidth: "200px",
                        }}
                      >
                        {subCategory.nombreSubCategoria}
                      </Button>
                    ))}
                  </Box>
                  {grupoIngrediente.map((group, groupIndex) => (
                    <Box
                      key={groupIndex}
                      sx={{
                        border: "1px solid #ddd",
                        padding: 2,
                        marginBottom: 2,
                      }}
                    >
                      <TextField
                        label="Nombre Grupo"
                        value={group.nombreGrupo}
                        onChange={(e) => {
                          const newGroups = [...grupoIngrediente];
                          newGroups[groupIndex].nombreGrupo = e.target.value;
                          setGrupoIngrediente(newGroups);
                        }}
                        fullWidth
                        margin="normal"
                      />

                      {group.items.map((item, itemIndex) => (
                        <Box
                          key={`${groupIndex}-${itemIndex}`}
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            mb: 3,
                          }}
                        >
                          <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={6} md={2}>
                              <TextField
                                fullWidth
                                label="Valor"
                                type="text"
                                value={item.valor}
                                onChange={(e) => {
                                  const input = e.target.value;
                                  const regex = /^[0-9/]*$/;
                                  if (regex.test(input)) {
                                    const newGroups = [...grupoIngrediente];
                                    newGroups[groupIndex].items[
                                      itemIndex
                                    ].valor = input;
                                    setGrupoIngrediente(newGroups);
                                  }
                                }}
                              />
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                              <Autocomplete
                                fullWidth
                                options={medidasAll || []}
                                getOptionLabel={(option) => option.nombreMedida}
                                value={
                                  medidasAll?.find(
                                    (m) => m._id === item.idMedida
                                  ) || null
                                }
                                onChange={(e, newValue) => {
                                  const newGroups = [...grupoIngrediente];
                                  newGroups[groupIndex].items[
                                    itemIndex
                                  ].idMedida = newValue?._id || "";
                                  setGrupoIngrediente(newGroups);
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Medida"
                                    fullWidth
                                  />
                                )}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  width: "100%",
                                }}
                              >
                                <Autocomplete
                                  fullWidth
                                  options={ingredientesAll || []}
                                  getOptionLabel={(option) =>
                                    option?.nombreIngrediente || ""
                                  }
                                  value={
                                    ingredientesAll?.find(
                                      (ing) => ing._id === item.idIngrediente
                                    ) || null
                                  }
                                  onChange={(e, newValue) => {
                                    const newGroups = [...grupoIngrediente];
                                    newGroups[groupIndex].items[
                                      itemIndex
                                    ].idIngrediente = newValue?._id || "";
                                    setGrupoIngrediente(newGroups);
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="Ingrediente"
                                      fullWidth
                                    />
                                  )}
                                />

                                <Tooltip title="¿No encuentras tu ingrediente en la lista? Agrégalo aquí">
                                  <IconButton
                                    onClick={handleOpenModalIngrediente}
                                    size="small"
                                    sx={{ mt: "4px" }} // pequeño ajuste vertical si es necesario
                                  >
                                    <HelpOutline fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                              <FormControl fullWidth>
                                <InputLabel>Presentación</InputLabel>
                                <Select
                                  value={item.idPresentacion || ""}
                                  onChange={(e) => {
                                    const newGroups = [...grupoIngrediente];
                                    newGroups[groupIndex].items[
                                      itemIndex
                                    ].idPresentacion = e.target.value;
                                    setGrupoIngrediente(newGroups);
                                  }}
                                >
                                  <MenuItem value="">
                                    <em>Sin presentación</em>
                                  </MenuItem>
                                  {presentacionesAll?.map((pres) => (
                                    <MenuItem key={pres._id} value={pres._id}>
                                      {pres.nombrePresentacion}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Grid>
                          </Grid>
                          <Box sx={{ pl: { xs: 0, md: 2 } }}>
                            {item.alternativas?.map((alt, altIndex) => (
                              <Grid
                                container
                                spacing={2}
                                alignItems="center"
                                key={`${groupIndex}-${itemIndex}-alt-${altIndex}`}
                                sx={{ mt: 1 }}
                              >
                                <Grid item xs={12} sm={6} md={5}>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                      width: "100%",
                                    }}
                                  >
                                    <Autocomplete
                                      fullWidth
                                      options={ingredientesAll || []}
                                      getOptionLabel={(option) =>
                                        option?.nombreIngrediente || ""
                                      }
                                      value={
                                        ingredientesAll?.find(
                                          (ing) => ing._id === alt.idIngrediente
                                        ) || null
                                      }
                                      onChange={(e, newValue) => {
                                        const newGroups = [...grupoIngrediente];
                                        newGroups[groupIndex].items[
                                          itemIndex
                                        ].alternativas[altIndex].idIngrediente =
                                          newValue?._id || "";
                                        setGrupoIngrediente(newGroups);
                                      }}
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          label="Alternativa Ingrediente"
                                          fullWidth
                                        />
                                      )}
                                    />

                                    <Tooltip title="¿No encuentras tu ingrediente en la lista? Agrégalo aquí">
                                      <IconButton
                                        onClick={handleOpenModalIngrediente}
                                        size="small"
                                        sx={{ mt: "4px" }}
                                      >
                                        <HelpOutline fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  </Box>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <Button
                                    onClick={() =>
                                      handleDeleteAlternativa(
                                        groupIndex,
                                        itemIndex,
                                        altIndex
                                      )
                                    }
                                    variant="outlined"
                                    color="error"
                                    fullWidth
                                  >
                                    Eliminar
                                  </Button>
                                </Grid>
                              </Grid>
                            ))}
                            <Button
                              onClick={() =>
                                handleAddAlternativa(groupIndex, itemIndex)
                              }
                              variant="outlined"
                              sx={{ mt: 1 }}
                            >
                              Agregar Alternativa
                            </Button>
                          </Box>
                          {group.items.length > 1 && (
                            <Grid item xs={12} sm={6} md={3}>
                              <Button
                                onClick={() =>
                                  handleDeleteItem(groupIndex, itemIndex)
                                }
                                variant="outlined"
                                color="error"
                                fullWidth
                              >
                                Eliminar Item
                              </Button>
                            </Grid>
                          )}
                        </Box>
                      ))}

                      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between', width:'100%'}}>
                        <Button
                          onClick={() => handleAddItem(groupIndex)}
                          variant="contained"
                          sx={{ mt: 2 }}
                        >
                          Agregar Ingrediente
                        </Button>

                        {grupoIngrediente.length > 1 && (
                          <Button
                            onClick={() =>
                              handleDeleteGrupoIngrediente(groupIndex)
                            }
                            variant="outlined"
                            color="error"
                            sx={{ mt: 2 }}
                          >
                            Eliminar Grupo
                          </Button>
                        )}
                      </div>
                    </Box>
                  ))}
                  <Button
                    onClick={handleAddGrupoIngrediente}
                    variant="contained"
                  >
                    Agregar Grupo De Ingredientes
                  </Button>
                  {pasos?.map((step, index) => (
                    <Box
                      key={index}
                      sx={{
                        border: "1px solid #ddd",
                        padding: 2,
                        marginBottom: 2,
                      }}
                    >
                      <TextField
                        label="Paso numero"
                        type="number"
                        value={step.pasoNumero}
                        onChange={(e) => {
                          const newPasos = [...pasos];
                          newPasos[index].pasoNumero = parseInt(e.target.value);
                          setPasos(newPasos);
                        }}
                        disabled={true}
                        fullWidth
                        margin="normal"
                      />
                      <Box sx={{ position: "relative" }}>
                        <TextField
                          label="Descripcion"
                          value={step.descripcion}
                          onChange={(e) => {
                            const newPasos = [...pasos];
                            newPasos[index].descripcion = e.target.value;
                            setPasos(newPasos);
                          }}
                          multiline
                          rows={2}
                          fullWidth
                          margin="normal"
                          inputProps={{ maxLength: 500 }}
                        />
                        <Typography
                          sx={{
                            position: "absolute",
                            bottom: 8,
                            right: 8,
                          }}
                          variant="caption"
                          color="textSecondary"
                        >
                          {step.descripcion.length}/{500}
                        </Typography>
                      </Box>
                      {pasos.length > 1 && (
                        <Button
                          onClick={() => handleDeletePaso(index)}
                          variant="outlined"
                          color="error"
                        >
                          Eliminar Paso
                        </Button>
                      )}
                    </Box>
                  ))}
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Button onClick={handleAddPaso} variant="contained">
                      Agregar Paso
                    </Button>
                    <Button type="submit" variant="contained" color="warning">
                      Actualizar Receta
                    </Button>
                  </div>
                </form>
              </div>
            </div>
            {loading && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  zIndex: 1000,
                }}
              >
                <CircularProgress />
              </Box>
            )}
          </Box>
        </Slide>
      </Modal>
      <Modal open={openModalIngrediente} onClose={handleCloseModalIngrediente}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            width: { xs: "75%", sm: "50%", md: "40%" },
          }}
        >
          <Typography variant="h6" gutterBottom>
            Agregar nuevo ingrediente a la lista
          </Typography>
          <TextField
            label="Nombre del ingrediente"
            fullWidth
            margin="normal"
            value={nuevoIngredienteNombre}
            onChange={(e) => {
              const input = e.target.value;
              const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/;
              if (regex.test(input) || input === "") {
                setNuevoIngredienteNombre(input);
              }
            }}
            inputProps={{
              inputMode: "text",
              pattern: "[A-Za-zÁÉÍÓÚáéíóúÑñ\\s]*",
            }}
          />
          <Box
            sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}
          >
            <Button onClick={handleCloseModalIngrediente}>Cancelar</Button>
            <Button
              variant="contained"
              onClick={handleCrearIngrediente}
              disabled={!nuevoIngredienteNombre.trim()}
            >
              Crear
            </Button>
          </Box>
          {loadingNewIngrediente ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 1000,
              }}
            >
              <CircularProgress />
            </Box>
          ) : null}
        </Box>
      </Modal>
    </>
  );
};
