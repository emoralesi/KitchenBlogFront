import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import { GetRecetasByIdReceta, GetRecetasByIdUser, saveReactionReceta, saveReceta } from "../services/RecetaService";

export const useReceta = () => {

    const [misRecetas, setMisRecetas] = useState([]);
    const [detailsReceta, setDetailsReceta] = useState([]);

    const guardarReceta = async ({ data }) => {

        try {
            const result = await saveReceta({ receta: data });
            enqueueSnackbar('Receta Registrado correctaente', { variant: 'success' });
            return true;

        } catch (error) {
            enqueueSnackbar('A ocurrido un error, favor intente mas tarde', { variant: 'error' });
            return false;
            console.log(error);
        } finally {
        }

    }

    const saveUpdateReactionReceta = async ({ data }) => {

        try {
            await saveReactionReceta({ data: data });
            enqueueSnackbar('Like Registrado correctaente', { variant: 'success' });
            return true;

        } catch (error) {
            enqueueSnackbar('A ocurrido un error, favor intente mas tarde', { variant: 'error' });
            return false;
            console.log(error);
        } finally {
        }

    }

    const getUserAndReceta = async ({ userId }) => {
        console.log("data al getUserAndReceta", userId);
        try {
            const result = await GetRecetasByIdUser({ idUser: { userId } });
            setMisRecetas(result.Recetas);
        } catch (error) {
            enqueueSnackbar('A ocurrido un error, favor intente mas tarde', { variant: 'error' });
            console.log(error);
        } finally {
        }
    }

    const getDetailsReceta = async ({ recetaId }) => {

        try {
            const result = await GetRecetasByIdReceta({ recetaId: { recetaId } });
            setDetailsReceta(result.Receta);
            return result?.Receta
        } catch (error) {
            enqueueSnackbar('A ocurrido un error, favor intente mas tarde', { variant: 'error' });
            console.log(error);
        } finally {
        }
    }

    return { guardarReceta, GetRecetasByIdReceta, GetRecetasByIdUser, getDetailsReceta, getUserAndReceta, detailsReceta, misRecetas, saveUpdateReactionReceta }
}