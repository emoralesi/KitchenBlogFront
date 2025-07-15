import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import {
  desactivateRecepies,
  GetRecetasByIdReceta,
  GetRecetasByIdUser,
  GetRecetasInfo,
  saveReactionReceta,
  saveReceta,
  updatePined,
  updateReceta,
} from "../services/RecetaService";

export const useReceta = () => {
  const [misRecetas, setMisRecetas] = useState([]);
  const [detailsReceta, setDetailsReceta] = useState([]);
  const [recetasInfo, setRecetasInfo] = useState([]);
  const [cantidadReceta, setCantidadReceta] = useState(null);
  const [reactionInfo, setReactionInfo] = useState(null);
  const [favouriteInfo, setFavouriteInfo] = useState(null);

  const guardarReceta = async ({ data }) => {
    try {
      const result = await saveReceta({ receta: data });
      if (result.status == "ok") {
        enqueueSnackbar("Receta Registrado correctaente", {
          variant: "success",
        });
      } else {
        enqueueSnackbar("Hubo un error al guardar la receta", {
          variant: "error",
        });
      }
      return result;
    } catch (error) {
      enqueueSnackbar("A ocurrido un error, favor intente mas tarde", {
        variant: "error",
      });
      return false;
      console.log(error);
    } finally {
    }
  };

  const actualizarPined = async (id, action) => {
    try {
      const result = await updatePined({ data: { id: id, action: action } });
      return true;
    } catch (error) {
      enqueueSnackbar("A ocurrido un error, favor intente mas tarde", {
        variant: "error",
      });
      return false;
      console.log(error);
    } finally {
    }
  };

  const actualizarReceta = async ({ data }) => {
    try {
      const result = await updateReceta({ receta: data });
      if (result.status === "ok") {
        enqueueSnackbar("Receta actualizada correctaente", {
          variant: "success",
        });
      } else {
        enqueueSnackbar("No fue posible actualizar la receta", {
          variant: "error",
        });
      }

      return result;
    } catch (error) {
      enqueueSnackbar("A ocurrido un error, favor intente mas tarde", {
        variant: "error",
      });
      return false;
      console.log(error);
    } finally {
    }
  };

  const saveUpdateReactionReceta = async ({ data }) => {
    try {
      await saveReactionReceta({ data: data });
      enqueueSnackbar("Like Registrado correctaente", { variant: "success" });
      return true;
    } catch (error) {
      enqueueSnackbar("A ocurrido un error, favor intente mas tarde", {
        variant: "error",
      });
      console.log(error);
      return false;
    } finally {
    }
  };

  const getUserAndReceta = async ({ data }) => {
    try {
      const result = await GetRecetasByIdUser({ data });

      setMisRecetas(result.Recetas);
      setReactionInfo(
        result.Recetas?.map((recipe) => {
          return {
            idReceta: recipe._id,
            usuarios_id_reaction: recipe.reactions.map(
              (reaction) => reaction.user_id
            ),
          };
        })
      );

      setFavouriteInfo(
        result.Recetas?.map((recipe) => {
          return {
            idReceta: recipe._id,
            usuarios_id_favourite: recipe.favourite,
          };
        })
      );
      return result;
    } catch (error) {
      enqueueSnackbar("A ocurrido un error, favor intente mas tarde", {
        variant: "error",
      });
      console.log(error);
    } finally {
    }
  };

  const ObtenerRecetasInfo = async ({ data }) => {
    try {
      const result = await GetRecetasInfo({ data });
      setReactionInfo(
        result.Recetas?.map((recipe) => {
          return {
            idReceta: recipe._id,
            usuarios_id_reaction: recipe.reactions.map(
              (reaction) => reaction.user_id
            ),
          };
        })
      );

      setFavouriteInfo(
        result.Recetas?.map((recipe) => {
          return {
            idReceta: recipe._id,
            usuarios_id_favourite: recipe.favourite,
          };
        })
      );
      setRecetasInfo(result.Recetas);
      setCantidadReceta(result.totalRecetas);
      return result;
    } catch (error) {
      enqueueSnackbar("A ocurrido un error, favor intente mas tarde", {
        variant: "error",
      });
      console.log(error);
    } finally {
    }
  };

  const getDetailsReceta = async ({ recetaId }) => {
    try {
      const result = await GetRecetasByIdReceta({ recetaId: { recetaId } });
      setDetailsReceta(result.Receta[0]);
      return result?.Receta[0];
    } catch (error) {
      enqueueSnackbar("A ocurrido un error, favor intente mas tarde", {
        variant: "error",
      });
      console.log(error);
    } finally {
    }
  };
  const desactivarReceta = async ({ recetaId }) => {
    try {
      const result = await desactivateRecepies({ recetaId: { recetaId } });
      return result;
    } catch (error) {
      enqueueSnackbar("A ocurrido un error, favor intente mas tarde", {
        variant: "error",
      });
      console.log(error);
    } finally {
    }
  };

  return {
    guardarReceta,
    GetRecetasByIdReceta,
    GetRecetasByIdUser,
    getDetailsReceta,
    getUserAndReceta,
    detailsReceta,
    misRecetas,
    saveUpdateReactionReceta,
    setMisRecetas,
    actualizarReceta,
    actualizarPined,
    desactivarReceta,
    ObtenerRecetasInfo,
    recetasInfo,
    cantidadReceta,
    reactionInfo,
    favouriteInfo,
    setFavouriteInfo,
    setReactionInfo,
  };
};
