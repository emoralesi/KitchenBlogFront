import { Accordion, AccordionDetails, AccordionSummary, Box, Grid, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export const RecipeThirdPart = ({ data }) => {

    return (
        <Grid container item xs={12} sx={{ width: '100%', padding: 0 }}>
            <Accordion defaultExpanded sx={{ width: '100%', padding: 0 }} >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{ width: '100%', padding: 0 }}
                >
                    <h1>Pasos</h1>
                </AccordionSummary>
                <AccordionDetails sx={{ width: '100%', padding: 0 }}>
                    {data.pasos
                        .sort((a, b) => a.pasoNumero - b.pasoNumero)
                        .map((value) => (
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>

                                    <h3>Step : {value.pasoNumero}</h3>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'start' }}>

                                    <p>{value.descripcion}</p>
                                </div>
                            </div>
                        ))}
                </AccordionDetails>
            </Accordion>
        </Grid>
    )
}

export default RecipeThirdPart;