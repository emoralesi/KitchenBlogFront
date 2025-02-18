import { Box, Grid, ImageList, ImageListItem } from "@mui/material";
import ExpandableText from "../../../utils/LongText";

export const RecipeFirstPart = ({ detailsReceta }) => {

    const transformCloudinaryUrl = (url, width, height) => {
        // Inserta la transformación en la URL
        return url.replace("/upload/", `/upload/w_${width},h_${height},c_fill,q_auto,f_auto/`);
    };

    return (
        <Grid container sx={{ width: '100%' }}>
            <Grid item xs={12} sm={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column', width: '100%', marginBottom: '20px' }}>
                <Box sx={{ width: '100%' }} >
                    <h1>{detailsReceta.titulo}</h1>
                    <ImageList
                        sx={{ width: '100%', height: 'auto', alignItems: 'center' }}
                        cols={detailsReceta.images.length}
                        gap={8}
                    >
                        {detailsReceta.images.map((image, index) => (
                            <ImageListItem key={index} sx={{ justifyItems: 'center', width: '100%', alignItems: 'center' }}>
                                <img
                                    src={transformCloudinaryUrl(image, 300, 200)}
                                    alt={`Image ${index}`}
                                    loading="lazy"
                                    style={{
                                        width: '200px',
                                        height: '200px',
                                        objectFit: 'cover',
                                    }}
                                />
                            </ImageListItem>
                        ))}
                    </ImageList>
                    <div>
                        <ExpandableText text={detailsReceta.descripcion} maxLength={150} />
                    </div>
                </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column', width: '100%', marginBottom: '20px' }} >
                <Box>
                    <div>
                        <h2>INGREDIENTS</h2>
                    </div>
                    <div>
                        {
                            detailsReceta.grupoIngrediente?.map((value) => (
                                <div key={value.nombreGrupo}>
                                    <h4>{value.nombreGrupo}</h4>
                                    {value.item.map((value2, index) => (
                                        <p>{`${value2.valor} ${value2.medida.nombreMedida == 'Quantity' ? '' : value2.medida.nombreMedida} ${value2.ingrediente.nombreIngrediente}`}</p>
                                    ))}
                                </div>
                            ))
                        }
                    </div>
                </Box>
            </Grid>
        </Grid>
    )
}

export default RecipeFirstPart;