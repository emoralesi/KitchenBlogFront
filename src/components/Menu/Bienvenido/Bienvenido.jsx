import PersonIcon from "@mui/icons-material/Person";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";

const menuItems = [
  {
    icon: <PersonIcon fontSize="large" color="primary" />,
    title: "Mi Perfil",
    description:
      "Accede a tu perfil personal. Aquí puedes ver tus recetas, crearlas, editarlas y gestionar tus publicaciones.",
  },
  {
    icon: <SearchIcon fontSize="large" color="primary" />,
    title: "Explorar Recetas",
    description:
      "Descubre recetas creadas por otros usuarios. Usa filtros para encontrar exactamente lo que estás buscando.",
  },
  {
    icon: <RestaurantIcon fontSize="large" color="primary" />,
    title: "Descubrir Chefs",
    description:
      "Busca y descubre a otros chefs. Visita sus perfiles para ver sus recetas y obtener inspiración.",
  },
  {
    icon: <ShoppingCartIcon fontSize="large" color="primary" />,
    title: "Shopping List",
    description:
      "Crea una lista de compras a partir de tus recetas favoritas. Personalízala según tus necesidades.",
  },
];

export const Bienvenido = () => {
  return (
    <Box
      sx={{
        overflowY: "auto",
        height: "-webkit-fill-available",
        backgroundColor: "#f9f9f9",
        paddingLeft:'10px',
        paddingRight:'10px',
        paddingBottom:'10px',
        paddingTop:'40px'
        
      }}
    >
      <Typography variant="h4" gutterBottom fontWeight={600}>
        Bienvenido a tu Blog De Cocina
      </Typography>
      <Typography variant="body1" gutterBottom color="text.secondary" mb={4}>
        Usa el menú lateral para navegar por la aplicación. Aquí tienes una
        breve descripción de cada sección:
      </Typography>

      <Grid container spacing={3}>
        {menuItems.map((item, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card
              variant="outlined"
              sx={{
                height: "100%",
                width: "95%",
                borderRadius: 3,
                boxShadow: 1,
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                  transform: "scale(1.02)",
                  boxShadow: 3,
                },
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  {item.icon}
                  <Typography variant="h6" component="div" ml={2}>
                    {item.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
