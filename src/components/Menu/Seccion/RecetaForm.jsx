import { Box, Button, Modal, Slide, TextField, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useEffect, useState } from 'react';
import { useReceta } from '../../../Hooks/useReceta';
import { getStorageUser } from '../../../utils/StorageUser';
import { useCategoria } from '../../../Hooks/useCategoria';
import { useSubCategoria } from '../../../Hooks/useSubCategoria';
import { useIngrediente } from '../../../Hooks/useIngrediente';
import { useDificultad } from '../../../Hooks/useDificultad';
import { useMedida } from '../../../Hooks/useMedida';
import { useUtencilios } from '../../../Hooks/useUtencilios';

export const RecetaForm = ({ open, setOpen, getUserAndReceta }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [cantidadPersonas, setCantidadPersonas] = useState(0);
    const [dificultad, setDificultad] = useState('');
    const [categoria, setCategoria] = useState('');
    const [utencilio, setUtencilio] = useState([]);
    const [subCategoria, setSubCategoria] = useState([]);
    const [grupoIngrediente, setGrupoIngrediente] = useState([{ nombreGrupo: '', items: [{ id: 1, valor: 0, idIngrediente: '', idMedida: '' }] }]);
    const [pasos, setPasos] = useState([{ pasoNumero: 1, descripcion: '' }]);
    const [imagesRecipe, setImagesRecipe] = useState([]);
    const [imagesSteps, setImagesSteps] = useState([]);


    const handleClose = () => setOpen(false);
    const { guardarReceta } = useReceta();

    const { ObtenerCategoria, categoriasAll } = useCategoria();
    const { ObtenerSubCategorias, subCategoriasAll } = useSubCategoria();
    const { ObtenerIngrediente, ingredientesAll } = useIngrediente();
    const { ObtenerDificultad, dificultadesAll } = useDificultad();
    const { ObtenerMedida, medidasAll } = useMedida();
    const { ObtenerUntencilios, utenciliosAll } = useUtencilios()

    useEffect(() => {
        ObtenerCategoria();
        ObtenerSubCategorias();
        ObtenerIngrediente();
        ObtenerDificultad();
        ObtenerMedida();
        ObtenerUntencilios();
    }, []);

    const handleImageChange = (e) => {
        const selectedFiles = Array.from(e.target.files);

        // Limitar el número de imágenes seleccionadas a un máximo de 3
        if (selectedFiles.length > 3) {
            alert("Puedes subir un máximo de 3 imágenes");
            return;
        }

        setImagesRecipe(selectedFiles);
    };

    const handleAddGrupoIngrediente = () => {
        setGrupoIngrediente([...grupoIngrediente, { nombreGrupo: '', items: [{ id: 1, valor: 0, idIngrediente: '', idMedida: '' }] }]);
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
        newGroups[groupIndex].items.push({ id: newItemId, valor: 0, idIngrediente: '', idMedida: '' });
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
        setPasos([...pasos, { pasoNumero: pasos.length + 1, descripcion: '' }]);
    };

    const handleDeletePaso = (index) => {
        if (pasos.length > 1) {
            const newPasos = [...pasos];
            newPasos.splice(index, 1);
            console.log(newPasos);
            const newPasosSort = newPasos.map((objeto, index) => {
                objeto.pasoNumero = index + 1;
                return objeto;
            });
            setPasos(newPasosSort);
        }
    };

    const handleToggleSubCategoria = (categoryId) => {
        if (subCategoria.includes(categoryId)) {
            setSubCategoria(subCategoria.filter(id => id !== categoryId));
        } else {
            setSubCategoria([...subCategoria, categoryId]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (imagesRecipe.length < 1) {
            alert("Debes subir al menos 1 imagen");
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
            imagesSteps
        };
        console.log("mi data", data);
        await guardarReceta({ data: data });
        await getUserAndReceta({ userId: getStorageUser().usuarioId })
        handleClose();
        setTitle('');
        setDescription('');
        setHours(0);
        setMinutes(0);
        setCantidadPersonas(0);
        setDificultad('');
        setCategoria('');
        setUtencilio([]);
        setSubCategoria([]);
        setGrupoIngrediente([{ nombreGrupo: '', items: [{ id: 1, valor: 0, idIngrediente: '', idMedida: '' }] }]);
        setPasos([{ pasoNumero: 1, descripcion: '' }]);
    };

    return (
        <Modal
            open={open}
            closeAfterTransition
            BackdropProps={{
                timeout: 500,
            }}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Slide direction="up" in={open}>
                <Box
                    sx={{
                        width: { xs: '85vw', md: '85vw', lg: '90vw' },
                        height: { xs: '85vh', md: '85vh', lg: '90vh' },
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', width: '100%', height: '100%' }}>
                        <Button onClick={handleClose} size='small' sx={{ alignSelf: 'flex-end', height: '30px' }}>
                            X
                        </Button>
                        <div style={{ overflow: 'auto', width: '100%', height: '100%' }}>
                            <form onSubmit={handleSubmit}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                />
                                <TextField
                                    label="Title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="Description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    multiline
                                    rows={4}
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="Hours"
                                    type="number"
                                    value={hours}
                                    onChange={(e) => setHours(parseInt(e.target.value))}
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="Minutes"
                                    type="number"
                                    value={minutes}
                                    onChange={(e) => setMinutes(parseInt(e.target.value))}
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="amount of people"
                                    type="number"
                                    value={cantidadPersonas}
                                    onChange={(e) => setCantidadPersonas(parseInt(e.target.value))}
                                    fullWidth
                                    margin="normal"
                                />
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>Difficulty</InputLabel>
                                    <Select
                                        value={dificultad}
                                        onChange={(e) => setDificultad(e.target.value)}
                                    >
                                        {
                                            dificultadesAll?.map((dificulties) => (
                                                <MenuItem key={dificulties._id} value={dificulties._id}>
                                                    {dificulties.nombreDificultad}
                                                </MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>Category</InputLabel>
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
                                    <InputLabel>Utensils</InputLabel>
                                    <Select
                                        multiple
                                        value={utencilio}
                                        onChange={(e) => setUtencilio(e.target.value)}
                                    >
                                        {
                                            utenciliosAll?.map((utencilio) => (
                                                <MenuItem key={utencilio._id} value={utencilio._id}>
                                                    {utencilio.nombreUtencilio}
                                                </MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                                <Box sx={{ display: 'flex', gap: 1, marginBottom: 2, overflow: 'auto' }}>
                                    {subCategoriasAll.map((subCategory) => (
                                        <Button
                                            key={subCategory._id}
                                            variant={subCategoria.includes(subCategory._id) ? 'contained' : 'outlined'}
                                            onClick={() => handleToggleSubCategoria(subCategory._id)}
                                            sx={{
                                                transition: 'background-color 0.3s',
                                                '&:hover': {
                                                    backgroundColor: subCategoria.includes(subCategory._id) ? 'rgba(0, 0, 0, 0.12)' : 'rgba(0, 0, 0, 0.04)',
                                                },
                                                minWidth: '200px'
                                            }}
                                        >
                                            {subCategory.nombreSubCategoria}
                                        </Button>
                                    ))}
                                </Box>
                                {grupoIngrediente.map((group, groupIndex) => (
                                    <Box key={groupIndex} sx={{ border: '1px solid #ddd', padding: 2, marginBottom: 2 }}>
                                        <TextField
                                            label="Group Name"
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
                                            <Box key={item.id} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                                <TextField
                                                    label="Value"
                                                    type="number"
                                                    value={item.valor}
                                                    onChange={(e) => {
                                                        const newGroups = [...grupoIngrediente];
                                                        newGroups[groupIndex].items[itemIndex].valor = parseFloat(e.target.value);
                                                        setGrupoIngrediente(newGroups);
                                                    }}
                                                    fullWidth
                                                    margin="normal"
                                                />
                                                <FormControl fullWidth margin="normal">
                                                    <InputLabel>Measure</InputLabel>
                                                    <Select
                                                        value={item.idMedida}
                                                        onChange={(e) => {
                                                            const newGroups = [...grupoIngrediente];
                                                            newGroups[groupIndex].items[itemIndex].idMedida = e.target.value;
                                                            setGrupoIngrediente(newGroups);
                                                        }}
                                                    >
                                                        {
                                                            medidasAll?.map((medida) => (
                                                                <MenuItem key={medida._id} value={medida._id}>
                                                                    {medida.nombreMedida}
                                                                </MenuItem>
                                                            ))
                                                        }
                                                    </Select>
                                                </FormControl>
                                                <FormControl fullWidth margin="normal">
                                                    <InputLabel>Ingredient</InputLabel>
                                                    <Select
                                                        value={item.idIngrediente}
                                                        onChange={(e) => {
                                                            const newGroups = [...grupoIngrediente];
                                                            newGroups[groupIndex].items[itemIndex].idIngrediente = e.target.value;
                                                            setGrupoIngrediente(newGroups);
                                                        }}
                                                    >
                                                        {
                                                            ingredientesAll?.map((ingrediente) => (
                                                                <MenuItem key={ingrediente._id} value={ingrediente._id}>
                                                                    {ingrediente.nombreIngrediente}
                                                                </MenuItem>
                                                            ))
                                                        }
                                                    </Select>
                                                </FormControl>
                                                {group.items.length > 1 && (
                                                    <Button
                                                        onClick={() => handleDeleteItem(groupIndex, itemIndex)}
                                                        variant="outlined"
                                                        color="error"
                                                    >
                                                        Delete Item
                                                    </Button>
                                                )}
                                            </Box>
                                        ))}
                                        {grupoIngrediente.length > 1 && (
                                            <Button onClick={() => handleDeleteGrupoIngrediente(groupIndex)} variant="outlined" color="error">Delete Group</Button>
                                        )}
                                        <Button onClick={() => handleAddItem(groupIndex)} variant="contained">
                                            Add Item
                                        </Button>
                                    </Box>
                                ))}
                                <Button onClick={handleAddGrupoIngrediente} variant="contained">Add Ingredient Group</Button>
                                {pasos.map((step, index) => (
                                    <Box key={index} sx={{ border: '1px solid #ddd', padding: 2, marginBottom: 2 }}>
                                        <TextField
                                            label="Step Nuber"
                                            type="number"
                                            value={step.pasoNumero}
                                            onChange={(e) => {
                                                const newPasos = [...pasos];
                                                newPasos[index].pasoNumero = parseInt(e.target.value);
                                                setPasos(newPasos);
                                            }}
                                            fullWidth
                                            margin="normal"
                                        />
                                        <TextField
                                            label="Description"
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
                                        />
                                        {pasos.length > 1 && (
                                            <Button onClick={() => handleDeletePaso(index)} variant="outlined" color="error">Delete Paso</Button>
                                        )}
                                    </Box>
                                ))}
                                <Button onClick={handleAddPaso} variant="contained">Add Step</Button>
                                <Button type="submit" variant="contained" color="success">Save Recipe</Button>
                            </form>
                        </div>
                    </div>
                </Box>
            </Slide>
        </Modal>
    );
};    