import { useState } from "react";
import { getSubCategorias } from "../services/SubCategoriaService";

export const useSubCategoria = () => {

    const [subCategoriasAll, setSubCategoriasAll] = useState([]);

    const ObtenerSubCategorias = async () => {

        try {
            const result = await getSubCategorias();
            setSubCategoriasAll(result.data)

        } catch (error) {
            console.log(error);
        } finally {
        }

    }

    return { ObtenerSubCategorias, subCategoriasAll }
}