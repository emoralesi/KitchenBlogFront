import { useState } from "react";
import { getCategorias } from "../services/CategoriaService";

export const useCategoria = () => {

    const [categoriasAll, setCategoriasAll] = useState([]);

    const ObtenerCategoria = async () => {

        try {
            const result = await getCategorias();
            setCategoriasAll(result.data)

        } catch (error) {
            console.log(error);
        } finally {
        }

    }

    return { ObtenerCategoria, categoriasAll }
}