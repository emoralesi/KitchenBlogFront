import { Unauthorized } from "../utils/401Unauthorized";
import { getStorageUser } from "../utils/StorageUser";

export async function generateRecipe({ prompt }) {
    try {
        const data = { prompt };

        const requestOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getStorageUser().token}`
            },
            body: JSON.stringify(data)
        };

        const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/ai/receta`, requestOptions);


        console.log("res value", res);


        Unauthorized(res.status);

        // ⚠️ Lanzar error si status >= 400
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            const error = new Error(errorData.message || 'Error al generar receta');
            error.response = { status: res.status, data: errorData };
            throw error; // <-- Esto hace que tu retry funcione
        }


        return await res.json();

    } catch (error) {
        // 🔥 Crucial: lanzar error para retry
        throw error;
    }
}
