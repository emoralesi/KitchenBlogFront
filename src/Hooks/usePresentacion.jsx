import { useState } from "react";
import { getPresentaciones } from "../services/PresentacionService";

export const usePresentacion = () => {
  const [presentacionesAll, setPresentacionAll] = useState([]);

  const ObtenerPresentacion = async () => {
    try {
      const result = await getPresentaciones();
      setPresentacionAll(result.data);
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  return { ObtenerPresentacion, presentacionesAll };
};
