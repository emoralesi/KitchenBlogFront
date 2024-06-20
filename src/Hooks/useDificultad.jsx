import { useState } from "react";
import { getDificultad } from "../services/DificultadService";

export const useDificultad = () => {

    const [dificultadesAll, setDificultadesAll] = useState([]);

    const ObtenerDificultad = async () => {

        try {
            const result = await getDificultad();
            setDificultadesAll(result.data)

        } catch (error) {
            console.log(error);
        } finally {
        }

    }

    return { ObtenerDificultad, dificultadesAll }
}