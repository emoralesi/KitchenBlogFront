import { Box, Button, Modal, Slide, TextField, Typography, Select, MenuItem, FormControl, InputLabel, IconButton, Icon } from '@mui/material';
import { useEffect, useState } from 'react';
import { usePost } from '../../../Hooks/usePost';
import { getStorageUser } from '../../../utils/StorageUser';

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
    const [grupoIngrediente, setGrupoIngrediente] = useState([]);
    const [pasos, setPasos] = useState([]);

    const handleClose = () => setOpen(false);
    const { guardarReceta } = usePost();

    useEffect(() => {
    }, []);

    const handleAddGrupoIngrediente = () => {
        setGrupoIngrediente([...grupoIngrediente, { nombreGrupo: '', items: [{ valor: 0, idIngrediente: '', idMedida: '' }] }]);
    };

    const handleAddPaso = () => {
        setPasos([...pasos, { pasoNumero: pasos.length + 1, descripcion: '', images: [] }]);
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
        // You can now use the data object as needed
        guardarReceta(data);
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
                                        <MenuItem value="easy">Easy</MenuItem>
                                        <MenuItem value="medium">Medium</MenuItem>
                                        <MenuItem value="hard">Hard</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>Categoria</InputLabel>
                                    <Select
                                        value={categoria}
                                        onChange={(e) => setCategoria(e.target.value)}
                                    >
                                        <MenuItem value="dessert">Dessert</MenuItem>
                                        <MenuItem value="main">Main</MenuItem>
                                        <MenuItem value="appetizer">Appetizer</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>Utencilio</InputLabel>
                                    <Select
                                        multiple
                                        value={utencilio}
                                        onChange={(e) => setUtencilio(e.target.value)}
                                    >
                                        <MenuItem value="spoon">Spoon</MenuItem>
                                        <MenuItem value="knife">Knife</MenuItem>
                                        <MenuItem value="fork">Fork</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>SubCategoria</InputLabel>
                                    <Select
                                        multiple
                                        value={subCategoria}
                                        onChange={(e) => setSubCategoria(e.target.value)}
                                    >
                                        <MenuItem value="vegan">Vegan</MenuItem>
                                        <MenuItem value="gluten-free">Gluten-Free</MenuItem>
                                        <MenuItem value="vegetarian">Vegetarian</MenuItem>
                                    </Select>
                                </FormControl>
                                {grupoIngrediente.map((group, index) => (
                                    <Box key={index} sx={{ border: '1px solid #ddd', padding: 2, marginBottom: 2 }}>
                                        <TextField
                                            label="Nombre Grupo"
                                            value={group.nombreGrupo}
                                            onChange={(e) => {
                                                const newGroups = [...grupoIngrediente];
                                                newGroups[index].nombreGrupo = e.target.value;
                                                setGrupoIngrediente(newGroups);
                                            }}
                                            fullWidth
                                            margin="normal"
                                        />
                                        {group.items.map((item, itemIndex) => (
                                            <Box key={itemIndex} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                                <TextField
                                                    label="Valor"
                                                    type="number"
                                                    value={item.valor}
                                                    onChange={(e) => {
                                                        const newGroups = [...grupoIngrediente];
                                                        newGroups[index].items[itemIndex].valor = parseFloat(e.target.value);
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
                                                            newGroups[index].items[itemIndex].idIngrediente = e.target.value;
                                                            setGrupoIngrediente(newGroups);
                                                        }}
                                                    >
                                                        <MenuItem value="ingredient1">Ingredient 1</MenuItem>
                                                        <MenuItem value="ingredient2">Ingredient 2</MenuItem>
                                                        <MenuItem value="ingredient3">Ingredient 3</MenuItem>
                                                    </Select>
                                                </FormControl>
                                                <FormControl fullWidth margin="normal">
                                                    <InputLabel>Medida</InputLabel>
                                                    <Select
                                                        value={item.idMedida}
                                                        onChange={(e) => {
                                                            const newGroups = [...grupoIngrediente];
                                                            newGroups[index].items[itemIndex].idMedida = e.target.value;
                                                            setGrupoIngrediente(newGroups);
                                                        }}
                                                    >
                                                        <MenuItem value="measure1">Measure 1</MenuItem>
                                                        <MenuItem value="measure2">Measure 2</MenuItem>
                                                        <MenuItem value="measure3">Measure 3</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                        ))}
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
