import { enqueueSnackbar, useSnackbar } from "notistack";
import { generateRecipe } from "../services/AIService";

export const useAI = () => {

    const generarReceta = async ({ prompt }) => {
        try {
            const result = await generateRecipe({ prompt });

            // Si result tiene un status != 200 → lanzar error
            if (!result || result.error) {
                const errorObj = new Error(result?.error || "Error al generar receta");
                errorObj.response = result?.response; // opcional, para axios
                throw errorObj;
            }

            return result;

        } catch (error) {
            // 🔥 Crucial: lanzamos error para que el catch de handleAskIA lo capture
            throw error;
        }
    };


    return {
        generarReceta,
    };
};
