import { Grid, Box, Typography, Divider, Stack } from "@mui/material";
import ExpandableText from "../../../utils/LongText";
import { getCloudinaryUrl } from "../../../utils/GetCloudinaryUrl";

export const RecipeFirstPartAI = ({ detailsReceta }) => {
  detailsReceta.images = ["IA_Images/ChatGPT_Image_26_ene_2026_13_09_25_bi6hlb"]
  return (
    <Grid container spacing={4} sx={{ width: "100%" }}>
      {/* ======================
          COLUMNA IZQUIERDA
      ====================== */}
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
                alt="Imagen receta"
                loading="lazy"
                decoding="async"
                sx={{
                  width: 500,
                  height: 400,
                  objectFit: "cover",
                  borderRadius: 2,
                }}
              />
            ))}
          </Box>
        )}

        {detailsReceta.descripcion && (
          <ExpandableText
            text={detailsReceta.descripcion}
            maxLength={150}
          />
        )}
      </Grid>

      {/* ======================
          COLUMNA DERECHA
      ====================== */}
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
          {detailsReceta.grupoIngrediente?.map((grupo, gi) => (
            <Box key={`${grupo.nombreGrupo}-${gi}`}>
              <Typography variant="subtitle1" fontWeight={600}>
                {grupo.nombreGrupo}
              </Typography>

              {grupo.items?.map((item, idx) => (
                <Typography
                  key={idx}
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: 1 }}
                >
                  •{" "}
                  {`${item.valor} ${item.medida?.nombreMedida === "Cantidad"
                      ? ""
                      : item.medida?.nombreMedida ?? ""
                    } ${item.ingrediente?.nombreIngrediente ?? ""}`}
                </Typography>
              ))}
            </Box>
          ))}
        </Stack>
      </Grid>
    </Grid>
  );
};

export default RecipeFirstPartAI;