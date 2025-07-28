import { Unauthorized } from "../utils/401Unauthorized";
import { getStorageUser } from "../utils/StorageUser";

export async function getIngredientes() {
  try {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getStorageUser().token}`,
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    };

    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL}/obtenerIngredientes`,
      requestOptions
    )
      .then((res) => {
        Unauthorized(res.status);
        return res.json();
      })
      .then((res) => {
        return res;
      });

    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function saveIngrediente({ nuevoIngrediente }) {
  try {
    console.log("mi nuevo ingrediente", nuevoIngrediente);

    let data = {
      nuevoIngrediente: nuevoIngrediente,
    };

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getStorageUser().token}`,
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL}/saveIngrediente`,
      requestOptions
    )
      .then((res) => {
        Unauthorized(res.status);
        return res.json();
      })
      .then((res) => {
        return res;
      });
    return response;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
}
