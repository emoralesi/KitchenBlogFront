import { useState } from "react";
import { getUtencilios } from "../services/UtenciliosService.js";

export const useUtencilios = () => {

    const [utenciliosAll, setUtencilioAll] = useState([]);

    const ObtenerUntencilios = async () => {

        try {
            const result = await getUtencilios();
            setUtencilioAll(result.data)

        } catch (error) {
            console.log(error);
        } finally {
        }

    }

    return { ObtenerUntencilios, utenciliosAll }
}