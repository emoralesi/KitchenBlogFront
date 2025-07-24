import { Grid, Box, Typography, Divider, Stack } from "@mui/material";
import ExpandableText from "../../../utils/LongText";
import { getCloudinaryUrl } from "../../../utils/GetCloudinaryUrl";

export const RecipeFirstPart = ({ detailsReceta }) => {
  return (
    <Grid container spacing={4} sx={{ width: "100%" }}>
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography
          variant="h4"
          fontWeight={600}
          gutterBottom
          sx={{ width: "100%" }}
        >
          {detailsReceta.titulo}
        </Typography>

        {detailsReceta.images?.length > 0 && (
          <Box
            sx={{
              display: "flex",
              overflowX: "auto",
              gap: 2,
              py: 1,
              pr: 1,
              "&::-webkit-scrollbar": {
                height: 8,
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#ccc",
                borderRadius: 4,
              },
            }}
          >
            {detailsReceta.images.map((image, index) => (
              <Box
                key={index}
                component="img"
                src={getCloudinaryUrl(image)}
                alt="Imagen"
                loading="lazy"
                decoding="async"
                style={{
                  width: "500px",
                  height: "400px",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            ))}
          </Box>
        )}
        <ExpandableText text={detailsReceta.descripcion} maxLength={150} />
      </Grid>

      <Grid
        item
        xs={12}
        md={6}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <Typography variant="h5" fontWeight={500} gutterBottom>
          Ingredientes
        </Typography>

        <Divider sx={{ mb: 1 }} />

        <Stack spacing={2}>
          {detailsReceta.grupoIngrediente?.map((grupo) => (
            <Box key={grupo.nombreGrupo}>
              <Typography variant="subtitle1" fontWeight={600}>
                {grupo.nombreGrupo}
              </Typography>
              {grupo.item.map((item, idx) => {
                const tienePresentacion = item.presentacion?.nombrePresentacion;
                const textoPresentacion = tienePresentacion
                  ? ` (${tienePresentacion})`
                  : "";

                const alternativas = item.alternativas?.length
                  ? item.alternativas
                      .map((alt) => ` / ${alt.nombreIngrediente}`)
                      .join("")
                  : "";

                return (
                  <Typography
                    key={idx}
                    variant="body2"
                    color="text.secondary"
                    sx={{ ml: 1 }}
                  >
                    •{" "}
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
        </Stack>
      </Grid>
    </Grid>
  );
};

export default RecipeFirstPart;
