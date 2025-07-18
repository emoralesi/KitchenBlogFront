import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
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
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useCategoria } from "../../../Hooks/useCategoria";
import { useDificultad } from "../../../Hooks/useDificultad";
import { useIngrediente } from "../../../Hooks/useIngrediente";
import { useMedida } from "../../../Hooks/useMedida";
import { useReceta } from "../../../Hooks/useReceta";
import { useSubCategoria } from "../../../Hooks/useSubCategoria";
import { useUtencilios } from "../../../Hooks/useUtencilios";
import { getStorageUser } from "../../../utils/StorageUser";

export const RecetaForm = ({
  open,
  setOpen,
  setCantidadReceta,
  getUserAndReceta,
  setReactionInfo,
  setFavouriteInfo,
  page,
  limit,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [cantidadPersonas, setCantidadPersonas] = useState(0);
  const [dificultad, setDificultad] = useState("");
  const [categoria, setCategoria] = useState("");
  const [utencilio, setUtencilio] = useState([]);
  const [subCategoria, setSubCategoria] = useState([]);
  const [grupoIngrediente, setGrupoIngrediente] = useState([
    {
      nombreGrupo: "",
      items: [{ id: 1, valor: 0, idIngrediente: "", idMedida: "" }],
    },
  ]);
  const [pasos, setPasos] = useState([{ pasoNumero: 1, descripcion: "" }]);
  const [imagesRecipe, setImagesRecipe] = useState([]);
  const [imagesSteps, setImagesSteps] = useState([]);
  const [imageUrl, setImageUrl] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleClose = () => setOpen(false);
  const { guardarReceta } = useReceta();

  const { ObtenerCategoria, categoriasAll } = useCategoria();
  const { ObtenerSubCategorias, subCategoriasAll } = useSubCategoria();
  const { ObtenerIngrediente, ingredientesAll } = useIngrediente();
  const { ObtenerDificultad, dificultadesAll } = useDificultad();
  const { ObtenerMedida, medidasAll } = useMedida();
  const { ObtenerUntencilios, utenciliosAll } = useUtencilios();

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

  useEffect(() => {
    const savedFormData = JSON.parse(localStorage.getItem("recetaFormData"));
    if (savedFormData) {
      setTitle(savedFormData.title || "");
      setDescription(savedFormData.description || "");
      setHours(savedFormData.hours || 0);
      setMinutes(savedFormData.minutes || 0);
      setCantidadPersonas(savedFormData.cantidadPersonas || 0);
      setDificultad(savedFormData.dificultad || "");
      setCategoria(savedFormData.categoria || "");
      setUtencilio(savedFormData.utencilio || []);
      setSubCategoria(savedFormData.subCategoria || []);
      setGrupoIngrediente(
        savedFormData.grupoIngrediente || [
          {
            nombreGrupo: "",
            items: [{ id: 1, valor: 0, idIngrediente: "", idMedida: "" }],
          },
        ]
      );
      setPasos(savedFormData.pasos || [{ pasoNumero: 1, descripcion: "" }]);
    }

    ObtenerCategoria();
    ObtenerSubCategorias();
    ObtenerIngrediente();
    ObtenerDificultad();
    ObtenerMedida();
    ObtenerUntencilios();
  }, []);

  useEffect(() => {
    const formData = {
      title,
      description,
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
      imagesSteps,
    };
    localStorage.setItem("recetaFormData", JSON.stringify(formData));
  }, [
    title,
    description,
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
    imagesSteps,
  ]);

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const imageFiles = selectedFiles.filter((file) =>
      file.type.startsWith("image/")
    );
    const nonImageFiles = selectedFiles.filter(
      (file) => !file.type.startsWith("image/")
    );

    if (nonImageFiles.length > 0) {
      alert(
        "Solo puedes subir imágenes. Por favor, selecciona archivos de imagen."
      );
    }

    if (imageFiles.length > 5) {
      alert("Puedes subir un máximo de 5 imágenes");
      return;
    }

    if (imageFiles.length > 0) {
      setImagesRecipe((prevImages) => {
        const newImages = [...prevImages, ...imageFiles];
        return newImages;
      });

      setImageUrl((prevUrls) => {
        const newUrls = imageFiles.map((file) => URL.createObjectURL(file));
        return [...prevUrls, ...newUrls];
      });
    }
  };

  const handleAddGrupoIngrediente = () => {
    setGrupoIngrediente([
      ...grupoIngrediente,
      {
        nombreGrupo: "",
        items: [{ id: 1, valor: 0, idIngrediente: "", idMedida: "" }],
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
    const newItemId = newGroups[groupIndex].items.length + 1;
    newGroups[groupIndex].items.push({
      id: newItemId,
      valor: 0,
      idIngrediente: "",
      idMedida: "",
    });
    setGrupoIngrediente(newGroups);
  };

  const handleDeleteItem = (groupIndex, itemIndex) => {
    const newGroups = [...grupoIngrediente];
    if (newGroups[groupIndex].items.length > 1) {
      newGroups[groupIndex].items.splice(itemIndex, 1);
      setGrupoIngrediente(newGroups);
    }
  };

  const handleAddPaso = () => {
    setPasos([...pasos, { pasoNumero: pasos.length + 1, descripcion: "" }]);
  };

  const handleDeletePaso = (index) => {
    if (pasos.length > 1) {
      const newPasos = [...pasos];
      newPasos.splice(index, 1);
      const newPasosSort = newPasos.map((objeto, index) => {
        objeto.pasoNumero = index + 1;
        return objeto;
      });
      setPasos(newPasosSort);
    }
  };

  const handleToggleSubCategoria = (categoryId) => {
    if (subCategoria.includes(categoryId)) {
      setSubCategoria(subCategoria.filter((id) => id !== categoryId));
    } else {
      setSubCategoria([...subCategoria, categoryId]);
    }
  };

  const handleDeleteImage = (index) => {
    setImagesRecipe((prevImages) => prevImages.filter((_, i) => i !== index));
    setImageUrl((prevUrls) => prevUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("El título es obligatorio.");
      return;
    }

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
    for (const grupo of grupoIngrediente) {
      if (grupo.items.length === 0) {
        ingredientesValidos = false;
        break;
      }
      for (const item of grupo.items) {
        if (!(item.valor > 0) || !item.idIngrediente || !item.idMedida) {
          ingredientesValidos = false;
          break;
        }
      }
      if (!ingredientesValidos) break;
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

    const data = {
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
      user: getStorageUser().usuarioId,
      imagesRecipe,
      imagesSteps,
    };

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

    setLoading(true);

    try {
      const res = await guardarReceta({ data: data });

      if (res.status === "ok") {
        localStorage.removeItem("recetaFormData");
        setCantidadReceta((preValue) => preValue + 1);

        await getUserAndReceta({
          data: { userId: getStorageUser().usuarioId, page, limit },
        });

        handleClose();
        setTitle("");
        setDescription("");
        setHours(0);
        setMinutes(0);
        setCantidadPersonas(0);
        setDificultad("");
        setCategoria("");
        setUtencilio([]);
        setSubCategoria([]);
        setGrupoIngrediente([
          {
            nombreGrupo: "",
            items: [{ id: 1, valor: 0, idIngrediente: "", idMedida: "" }],
          },
        ]);
        setPasos([{ pasoNumero: 1, descripcion: "" }]);
      }
    } catch (error) {
      console.error("Error al guardar la receta:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
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
            width: { xs: "85vw", md: "85vw", lg: "90vw" },
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
                          src={image}
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
                    inputProps={{ maxLength: 250 }}
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
                    {description.length}/{250}
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
                    {categoriasAll.map((category) => (
                      <MenuItem key={category._id} value={category._id}>
                        {category.nombreCategoria}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Utencilios</InputLabel>
                  <Select
                    multiple
                    value={utencilio}
                    onChange={(e) => setUtencilio(e.target.value)}
                  >
                    {utenciliosAll?.map((utencilio) => (
                      <MenuItem key={utencilio._id} value={utencilio._id}>
                        {utencilio.nombreUtencilio}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    marginBottom: 2,
                    overflow: "auto",
                  }}
                >
                  {subCategoriasAll.map((subCategory) => (
                    <Button
                      key={subCategory._id}
                      variant={
                        subCategoria.includes(subCategory._id)
                          ? "contained"
                          : "outlined"
                      }
                      onClick={() => handleToggleSubCategoria(subCategory._id)}
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
                        key={item.id}
                        sx={{ display: "flex", gap: 2, alignItems: "center" }}
                      >
                        <TextField
                          label="Valor"
                          type="number"
                          value={item.valor}
                          onChange={(e) => {
                            const newGroups = [...grupoIngrediente];
                            newGroups[groupIndex].items[itemIndex].valor =
                              parseFloat(e.target.value);
                            setGrupoIngrediente(newGroups);
                          }}
                          fullWidth
                          margin="normal"
                        />
                        <FormControl fullWidth margin="normal">
                          <InputLabel>Medida</InputLabel>
                          <Select
                            value={item.idMedida}
                            onChange={(e) => {
                              const newGroups = [...grupoIngrediente];
                              newGroups[groupIndex].items[itemIndex].idMedida =
                                e.target.value;
                              setGrupoIngrediente(newGroups);
                            }}
                          >
                            {medidasAll?.map((medida) => (
                              <MenuItem key={medida._id} value={medida._id}>
                                {medida.nombreMedida}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                          <InputLabel>Ingrediente</InputLabel>
                          <Select
                            value={item.idIngrediente}
                            onChange={(e) => {
                              const newGroups = [...grupoIngrediente];
                              newGroups[groupIndex].items[
                                itemIndex
                              ].idIngrediente = e.target.value;
                              setGrupoIngrediente(newGroups);
                            }}
                          >
                            {ingredientesAll?.map((ingrediente) => (
                              <MenuItem
                                key={ingrediente._id}
                                value={ingrediente._id}
                              >
                                {ingrediente.nombreIngrediente}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {group.items.length > 1 && (
                          <Button
                            onClick={() =>
                              handleDeleteItem(groupIndex, itemIndex)
                            }
                            variant="outlined"
                            color="error"
                          >
                            Eliminar Item
                          </Button>
                        )}
                      </Box>
                    ))}
                    {grupoIngrediente.length > 1 && (
                      <Button
                        onClick={() => handleDeleteGrupoIngrediente(groupIndex)}
                        variant="outlined"
                        color="error"
                      >
                        Eliminar Group
                      </Button>
                    )}
                    <Button
                      onClick={() => handleAddItem(groupIndex)}
                      variant="contained"
                    >
                      Agergar Item
                    </Button>
                  </Box>
                ))}
                <Button onClick={handleAddGrupoIngrediente} variant="contained">
                  Agregar Grupo De Ingredientes
                </Button>
                {pasos.map((step, index) => (
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
                        inputProps={{ maxLength: 250 }}
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
                        {step.descripcion.length}/{250}
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
                  <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    sx={{ marginRight: "20px" }}
                  >
                    Crear Receta
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
  );
};