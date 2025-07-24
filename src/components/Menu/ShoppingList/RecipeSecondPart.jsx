import { Box } from "@mui/material"

export const RecipeSecondPart = ({ data }) => {

    return (
        <Box>
            <div>
                <h2>INGREDIENTES</h2>
            </div>
            <div>
                {
                    data.grupoIngrediente?.map((value) => (
                        <div key={value.nombreGrupo}>
                            <h4>{value.nombreGrupo}</h4>
                            {value.item.map((value2, index) => (
                                <p>{`${value2.valor} ${value2.medida.nombreMedida == 'Cantidad' ? '' : value2.medida.nombreMedida} ${value2.ingrediente.nombreIngrediente}`}</p>
                            ))}
                        </div>
                    ))
                }
            </div>
        </Box>
    )
}

export default RecipeSecondPart