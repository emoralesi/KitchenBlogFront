import { Unauthorized } from "../utils/401Unauthorized";
import { getStorageUser } from "../utils/StorageUser";

export async function getCategorias() {
    try {
        const requestOptions = {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getStorageUser().token}`,
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },

        };

        const response = await fetch(`http://localhost:3600/obtenerCategorias`, requestOptions).then((res) => {
            Unauthorized(res.status)
            return res.json()
        }).then((res) => {
            return res
        });

        return response

    } catch (error) {
        console.log(error);
        throw error
    }
}