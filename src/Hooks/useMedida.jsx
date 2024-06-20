import { useState } from "react";
import { getMedidas } from "../services/MedidaService";

export const useMedida = () => {

    const [medidasAll, setMedidasAll] = useState([]);

    const ObtenerMedida = async () => {

        try {
            const result = await getMedidas();
            setMedidasAll(result.data)

        } catch (error) {
            console.log(error);
        } finally {
        }

    }

    return { ObtenerMedida, medidasAll }
}