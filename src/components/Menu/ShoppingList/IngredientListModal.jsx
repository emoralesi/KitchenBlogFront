import { useState } from "react";
import {
  Box,
  Button,
  Modal,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  Stack,
  Divider,
} from "@mui/material";
import { Close, Delete, Add } from "@mui/icons-material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";

export const IngredientListModal = ({ data, open, setOpen }) => {
  const [recipes, setRecipes] = useState(
    data.map((recipe) => ({
      ...recipe,
      grupoIngrediente: recipe.grupoIngrediente.map((group) => ({
        ...group,
        newItem: "",
        item: group.item.map((item) => {
          const tienePresentacion =
            item.presentacion?.nombrePresentacion ||
            item.presentacion?.nombrePresentacion;
          const textoPresentacion = tienePresentacion
            ? ` (${tienePresentacion})`
            : "";

          const alternativas = item.alternativas?.length
            ? item.alternativas
                .map((alt) => ` / ${alt.nombreIngrediente}`)
                .join("")
            : "";

          const medida =
            item.medida.nombreMedida === "Cantidad"
              ? ""
              : item.medida.nombreMedida;

          return {
            ...item,
            fullIngredient: `${item.valor} ${medida} ${item.ingrediente.nombreIngrediente}${textoPresentacion}${alternativas}`,
          };
        }),
      })),
    }))
  );

  const handleAddIngredient = (recipeId, groupId) => {
    setRecipes(
      recipes.map((recipe) =>
        recipe._id === recipeId
          ? {
              ...recipe,
              grupoIngrediente: recipe.grupoIngrediente.map((group) =>
                group._id === groupId
                  ? {
                      ...group,
                      item: [
                        ...group.item,
                        {
                          _id: Date.now().toString(),
                          fullIngredient: group.newItem,
                        },
                      ],
                      newItem: "",
                    }
                  : group
              ),
            }
          : recipe
      )
    );
  };

  const handleNewItemChange = (recipeId, groupId, value) => {
    setRecipes(
      recipes.map((recipe) =>
        recipe._id === recipeId
          ? {
              ...recipe,
              grupoIngrediente: recipe.grupoIngrediente.map((group) =>
                group._id === groupId
                  ? {
                      ...group,
                      newItem: value,
                    }
                  : group
              ),
            }
          : recipe
      )
    );
  };

  const handleRemoveIngredient = (recipeId, groupId, ingredientId) => {
    setRecipes(
      recipes.map((recipe) =>
        recipe._id === recipeId
          ? {
              ...recipe,
              grupoIngrediente: recipe.grupoIngrediente.map((group) =>
                group._id === groupId
                  ? {
                      ...group,
                      item: group.item.filter(
                        (item) => item._id !== ingredientId
                      ),
                    }
                  : group
              ),
            }
          : recipe
      )
    );
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Box
        sx={{
          width: "90vw",
          maxWidth: 700,
          maxHeight: "90vh",
          bgcolor: "background.paper",
          p: 4,
          borderRadius: 3,
          boxShadow: 24,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          overflowY: "auto",
        }}
      >
        <IconButton
          onClick={() => setOpen(false)}
          sx={{ position: "absolute", top: 16, right: 16 }}
        >
          <Close />
        </IconButton>

        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Lista de Ingredientes
        </Typography>

        {recipes?.length === 0 && (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="50vh"
            textAlign="center"
            px={2}
          >
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No has agregado ninguna receta.
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Haz clic en el icono <CheckBoxOutlineBlankIcon fontSize="large" />{" "}
              de alguna receta para crear tu lista de compras.
            </Typography>
          </Box>
        )}

        {recipes?.map((recipe) => (
          <Box key={recipe._id} sx={{ mb: 4 }}>
            <Typography variant="h6" color="primary.main" gutterBottom>
              {recipe.titulo}
            </Typography>

            {recipe.grupoIngrediente.map((group, index) => (
              <Box key={group._id} sx={{ mb: 3 }}>
                {recipe.grupoIngrediente.length > 1 && (
                  <Typography
                    variant="subtitle1"
                    fontWeight="medium"
                    gutterBottom
                  >
                    {group.nombreGrupo}
                  </Typography>
                )}

                <List dense>
                  {group.item.map((item) => (
                    <ListItem
                      key={item._id}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          onClick={() =>
                            handleRemoveIngredient(
                              recipe._id,
                              group._id,
                              item._id
                            )
                          }
                        >
                          <Delete color="error" />
                        </IconButton>
                      }
                    >
                      <ListItemText primary={item.fullIngredient} />
                    </ListItem>
                  ))}
                </List>

                <Stack direction="row" spacing={1} mt={1}>
                  <TextField
                    size="small"
                    label="Nuevo ingrediente"
                    value={group.newItem}
                    onChange={(e) =>
                      handleNewItemChange(recipe._id, group._id, e.target.value)
                    }
                    fullWidth
                  />
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => handleAddIngredient(recipe._id, group._id)}
                  >
                    Agregar
                  </Button>
                </Stack>

                {index < recipe.grupoIngrediente.length - 1 && (
                  <Divider sx={{ mt: 3 }} />
                )}
              </Box>
            ))}
          </Box>
        ))}

        <Box
          sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}
        >
          <Button
            onClick={() => setOpen(false)}
            variant="outlined"
            color="secondary"
          >
            Cerrar
          </Button>
          <Button
            onClick={() => setOpen(false)}
            variant="contained"
            color="success"
          >
            Enviar Lista Al Correo
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
