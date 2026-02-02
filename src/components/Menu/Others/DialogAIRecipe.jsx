import {
    Dialog,
    DialogContent,
    DialogTitle,
    TextField,
    Button,
    Stack,
    CircularProgress,
    Typography,
    Modal,
} from "@mui/material";
import { useState } from "react";
import { useAI } from "../../../Hooks/useAI";
import { DetailsRecetaAI } from "./DetailsRecetaAI";
import { useSnackbar } from "notistack";

const retry = async (fn, maxRetries = 5, delay = 500) => {
    let lastError;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            // No reintentar en 400 Bad Request
            if (error?.response?.status === 400) break;
            // Esperar antes del próximo intento
            await new Promise((res) => setTimeout(res, delay));
        }
    }
    throw lastError;
};

export const DialogIARecipe = ({ open, onClose, onUseRecipe }) => {
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [openPreview, setOpenPreview] = useState(false);
    const [previewReceta, setPreviewReceta] = useState(null);
    const { generarReceta } = useAI();
    const { enqueueSnackbar } = useSnackbar();

    const handleAskIA = async () => {
        if (!prompt) return;

        setLoading(true);
        setPreviewReceta(null);

        try {
            const result = await retry(() => generarReceta({ prompt }), 5);

            // Validación básica de la receta
            if (!result?.receta) {
                const error = new Error("Receta no válida");
                error.code = "INVALID_RECIPE";
                throw error;
            }


            enqueueSnackbar("Receta generada correctamente", {
                variant: "success",
                autoHideDuration: 2000,
                anchorOrigin: { vertical: "top", horizontal: "left" },
            });

            setPreviewReceta(result.receta);
            // setPreviewReceta({
            //     "titulo": "Sopa simple de tomate y albahaca",
            //     "descripcion": "Una sopa ligera de tomate con albahaca fresca, ideal como entrada.",
            //     "hours": 0,
            //     "minutes": 30,
            //     "cantidadPersonas": 2,
            //     "dificultad": "Facil",
            //     "categoria": "Entrada",
            //     "subCategoria": [
            //         {
            //             "_id": "687aa39bde7e83e04f9b7b1b",
            //             "nombreSubCategoria": "Vegetariano"
            //         }
            //     ],
            //     "grupoIngrediente": [
            //         {
            //             "nombreGrupo": "Ingredientes",
            //             "item": [
            //                 {
            //                     "medida": {
            //                         "_id": "6880b511a7ebe5e9806451e1",
            //                         "nombreMedida": "Litros"
            //                     },
            //                     "ingrediente": {
            //                         "_id": "6880b688a7ebe5e9806451fe",
            //                         "nombreIngrediente": "Agua"
            //                     },
            //                     "valor": "1",
            //                     "alternativas": []
            //                 },
            //                 {
            //                     "medida": {
            //                         "_id": "6880b511a7ebe5e9806451db",
            //                         "nombreMedida": "Cucharadita"
            //                     },
            //                     "ingrediente": {
            //                         "_id": "6880b688a7ebe5e9806453bf",
            //                         "nombreIngrediente": "Sal"
            //                     },
            //                     "valor": "0.5",
            //                     "alternativas": []
            //                 },
            //                 {
            //                     "medida": {
            //                         "_id": "6880b511a7ebe5e9806451e7",
            //                         "nombreMedida": "Unidad"
            //                     },
            //                     "ingrediente": {
            //                         "_id": "6880b688a7ebe5e9806453f4",
            //                         "nombreIngrediente": "Tomate"
            //                     },
            //                     "valor": "3",
            //                     "alternativas": []
            //                 },
            //                 {
            //                     "medida": {
            //                         "_id": "688b641ec73d2492ed60ef0a",
            //                         "nombreMedida": "Ramita"
            //                     },
            //                     "ingrediente": {
            //                         "_id": "6880b688a7ebe5e980645209",
            //                         "nombreIngrediente": "Albahaca"
            //                     },
            //                     "valor": "5",
            //                     "alternativas": []
            //                 }
            //             ]
            //         }
            //     ],
            //     "utencilio": [
            //         {
            //             "_id": "6880b4b6a7ebe5e9806451bf",
            //             "nombreUtencilio": "Cacerola"
            //         }
            //     ],
            //     "pasos": [
            //         {
            //             "pasoNumero": 1,
            //             "descripcion": "Calienta el agua en una cacerola hasta que hierva."
            //         },
            //         {
            //             "pasoNumero": 2,
            //             "descripcion": "Añade los tomates picados y cocina durante 10 minutos."
            //         },
            //         {
            //             "pasoNumero": 3,
            //             "descripcion": "Agrega la albahaca y la sal, mezcla y cocina 5 minutos más."
            //         },
            //         {
            //             "pasoNumero": 4,
            //             "descripcion": "Licúa la mezcla hasta obtener una textura homogénea y sirve caliente."
            //         }
            //     ]
            // })
            setOpenPreview(true);
        } catch (error) {
            console.error("IA error:", error);

            // 🟥 400 BAD REQUEST → NO retry
            if (error?.response?.status === 400) {
                enqueueSnackbar(
                    error.response?.data?.message ||
                    "La solicitud no es válida. Revisa el texto ingresado.",
                    {
                        variant: "warning",
                        autoHideDuration: 3000,
                        anchorOrigin: { vertical: "top", horizontal: "left" },
                    }
                );
                return;
            }

            // 🟧 errores de IA
            if (error.code === "AI_INVALID_JSON") {
                enqueueSnackbar(
                    "La IA respondió incorrectamente después de varios intentos.",
                    { variant: "error" }
                );
                return;
            }

            if (error.code === "INVALID_RECIPE") {
                enqueueSnackbar("La receta generada no es válida.", { variant: "error" });
                return;
            }

            // 🔴 fallback
            enqueueSnackbar("Error inesperado al generar la receta.", { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Consulta a la IA 🍳</DialogTitle>

            <DialogContent>
                <Stack spacing={2}>
                    <TextField
                        label="¿Qué receta quieres?"
                        multiline
                        rows={3}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Ej: Dame una receta con cebolla, pollo y sal"
                    />

                    <Button
                        variant="contained"
                        onClick={handleAskIA}
                        disabled={!prompt || loading}
                    >
                        Consultar IA
                    </Button>

                    {loading && (
                        <Stack alignItems="center">
                            <CircularProgress />
                            <Typography variant="caption">Generando receta...</Typography>
                        </Stack>
                    )}

                    {previewReceta && (
                        <Modal
                            open={openPreview}
                            closeAfterTransition
                            BackdropProps={{ timeout: 500 }}
                            sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                        >
                            <DetailsRecetaAI
                                isFull={false}
                                isFromProfile={false}
                                origen={"perfilOwner"}
                                setOpen={setOpenPreview}
                                detailsReceta={previewReceta}
                            />
                        </Modal>
                    )}
                </Stack>
            </DialogContent>
        </Dialog>
    );
};

export default DialogIARecipe;