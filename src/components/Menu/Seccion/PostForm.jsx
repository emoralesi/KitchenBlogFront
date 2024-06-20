import { Box, Button, Modal, Slide, TextField, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useEffect, useState } from 'react';
import { usePost } from '../../../Hooks/usePost';
import { getStorageUser } from '../../../utils/StorageUser';
import { useCategoria } from '../../../Hooks/useCategoria';
import { useSubCategoria } from '../../../Hooks/useSubCategoria';
import { useIngrediente } from '../../../Hooks/useIngrediente';
import { useDificultad } from '../../../Hooks/useDificultad';
import { useMedida } from '../../../Hooks/useMedida';
import { useUtencilios } from '../../../Hooks/useUtencilios';

const categories = [
    { id: 'vegan', label: 'Vegan' },
    { id: 'gluten-free', label: 'Gluten-Free' },
    { id: 'vegetarian', label: 'Vegetarian' },
];

export const PostForm = ({ open, setOpen, getUserAndPost }) => {
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
    const [pasos, setPasos] = useState([{ pasoNumero: 1, descripcion: '', images: [] }]);

    const handleClose = () => setOpen(false);
    const { guardarReceta } = usePost();

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
        setPasos([...pasos, { pasoNumero: pasos.length + 1, descripcion: '', images: [] }]);
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
            setSubCategoria(subCategoria.filter(id => id !== categoryId));
        } else {
            setSubCategoria([...subCategoria, categoryId]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
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
        };
        console.log("mi data", data);
        //guardarReceta(data);
        handleClose();
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
                                <TextField
                                    label="Titulo"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="Descripcion"
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
                                    label="Cantidad Personas"
                                    type="number"
                                    value={cantidadPersonas}
                                    onChange={(e) => setCantidadPersonas(parseInt(e.target.value))}
                                    fullWidth
                                    margin="normal"
                                />
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>Dificultad</InputLabel>
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
                                    <InputLabel>Utencilio</InputLabel>
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
                                <Box sx={{ display: 'flex', gap: 1, marginBottom: 2 }}>
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
                                            }}
                                        >
                                            {subCategory.nombreSubCategoria}
                                        </Button>
                                    ))}
                                </Box>
                                {grupoIngrediente.map((group, groupIndex) => (
                                    <Box key={groupIndex} sx={{ border: '1px solid #ddd', padding: 2, marginBottom: 2 }}>
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
                                            <Box key={item.id} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                                <TextField
                                                    label="Valor"
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
                                                    <InputLabel>Ingrediente</InputLabel>
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
                                                <FormControl fullWidth margin="normal">
                                                    <InputLabel>Medida</InputLabel>
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
                                            <Button onClick={() => handleDeleteGrupoIngrediente(groupIndex)} variant="outlined" color="error">Delete Grupo</Button>
                                        )}
                                        <Button onClick={() => handleAddItem(groupIndex)} variant="contained">
                                            Add Item
                                        </Button>
                                    </Box>
                                ))}
                                <Button onClick={handleAddGrupoIngrediente} variant="contained">Add Grupo Ingrediente</Button>
                                {pasos.map((step, index) => (
                                    <Box key={index} sx={{ border: '1px solid #ddd', padding: 2, marginBottom: 2 }}>
                                        <TextField
                                            label="Paso Numero"
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
                                        />
                                        {pasos.length > 1 && (
                                            <Button onClick={() => handleDeletePaso(index)} variant="outlined" color="error">Delete Paso</Button>
                                        )}
                                    </Box>
                                ))}
                                <Button onClick={handleAddPaso} variant="contained">Add Paso</Button>
                                <Button type="submit" variant="contained" color="primary">Guardar Receta</Button>
                            </form>
                        </div>
                    </div>
                </Box>
            </Slide>
        </Modal>
    );
};    