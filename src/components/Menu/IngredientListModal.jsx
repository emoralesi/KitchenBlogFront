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
} from "@mui/material";
import { Delete, Add } from "@mui/icons-material";

export const IngredientListModal = ({ data, open, setOpen }) => {
  const [recipes, setRecipes] = useState(
    data.map((recipe) => ({
      ...recipe,
      grupoIngrediente: recipe.grupoIngrediente.map((group) => ({
        ...group,
        newItem: "", // Add a newItem property to each group
        item: group.item.map((item) => ({
          // Add fullIngredient to existing items
          ...item,
          fullIngredient: `${item.valor} ${item.medida.nombreMedida} - ${item.ingrediente.nombreIngrediente}`,
        })),
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
                      newItem: value, // Update the newItem for this group
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
          width: "80vw",
          height: "80vh",
          bgcolor: "background.paper",
          p: 2,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          overflowY: "auto",
        }}
      >
        <div style={{ width: "100%", display: "flex", justifyContent: "end" }}>
          <Button
            onClick={() => {
              setOpen(false);
            }}
            size="small"
          >
            X
          </Button>
        </div>

        <Typography variant="h5" gutterBottom>
          Lista de Ingredientes
        </Typography>
        {recipes.map((recipe) => (
          <Box key={recipe._id} sx={{ mb: 3 }}>
            <Typography variant="h6">{recipe.titulo}</Typography>
            {recipe.grupoIngrediente.map((group) => (
              <Box key={group._id} sx={{ mb: 2 }}>
                {recipe.grupoIngrediente.length > 1 ? (
                  <Typography variant="subtitle1" fontWeight="bold">
                    {group.nombreGrupo}
                  </Typography>
                ) : (
                  <></>
                )}
                <List>
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
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <TextField
                    size="small"
                    label="Nuevo ingrediente"
                    value={group.newItem} // Bind to group's newItem
                    onChange={(e) =>
                      handleNewItemChange(recipe._id, group._id, e.target.value)
                    }
                  />
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => handleAddIngredient(recipe._id, group._id)}
                  >
                    Agregar
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        ))}
        <div
          style={{ display: "flex", justifyContent: "space-between", gap: 15 }}
        >
          <Button
            onClick={() => setOpen(false)}
            variant="contained"
            color="secondary"
            sx={{ mt: 2 }}
          >
            Cerrar
          </Button>
          <Button
            onClick={() => setOpen(false)}
            variant="contained"
            color="success"
            sx={{ mt: 2 }}
          >
            Enviar Lista Al Correo
          </Button>
        </div>
      </Box>
    </Modal>
  );
};
