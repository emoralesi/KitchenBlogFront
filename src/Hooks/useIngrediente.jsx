import { useState } from "react";
import { getIngredientes } from "../services/IngredienteService";

export const useIngrediente = () => {

    const [ingredientesAll, setIngredientesAll] = useState([]);

    const ObtenerIngrediente = async () => {

        try {
            const result = await getIngredientes();
            setIngredientesAll(result.data)

        } catch (error) {
            console.log(error);
        } finally {
        }

    }

    return { ObtenerIngrediente, ingredientesAll }
}