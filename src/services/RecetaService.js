import { Unauthorized } from "../utils/401Unauthorized";
import { getStorageUser } from "../utils/StorageUser";

export async function saveReceta({ receta }) {

    try {
        const formData = new FormData();

        receta.imagesRecipe.forEach(image => {
            formData.append('recipeImages', image);
        });

        receta.imagesSteps.forEach(image => {
            formData.append('stepsImages', image);
        });
        formData.append('receta', JSON.stringify(receta));


        const requestOptions = {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${getStorageUser().token}`
            },
            body: formData
        };

        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/saveReceta`, requestOptions).then((res) => {
            Unauthorized(res.status)
            return res.json()
        }).then((res) => {
            return res
        });

        console.log("este es mi response", response);
        return response

    } catch (error) {
        console.log("error", error);
        throw error
    }
}

export async function updateReceta({ receta }) {

    try {

        const requestOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getStorageUser().token}`
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(receta)

        };

        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/updateReceta`, requestOptions).then((res) => {
            Unauthorized(res.status)
            return res.json()
        }).then((res) => {
            return res
        });

        console.log("este es mi response", response);
        return response

    } catch (error) {
        console.log("error", error);
        throw error
    }
}

export async function updatePined({ data }) {

    console.log("mi datasi ultra unimark", data);

    try {

        const requestOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getStorageUser().token}`
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(data)

        };

        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/updatePined`, requestOptions).then((res) => {
            Unauthorized(res.status)
            return res.json()
        }).then((res) => {
            return res
        });

        console.log("este es mi response", response);
        return response

    } catch (error) {
        console.log("error", error);
        throw error
    }
}
export async function saveReactionReceta({ data }) {

    try {

        const requestOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getStorageUser().token}`
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(data)

        };

        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/saveUpdateRecetaReaction`, requestOptions).then((res) => {
            Unauthorized(res.status)
            return res.json()
        }).then((res) => {
            return res
        });

        console.log("este es mi response", response);
        return response

    } catch (error) {
        console.log("error", error);
        throw error
    }
}

export async function GetRecetasByIdUser({ data }) {

    try {
        console.log("mi receta service data", data);

        const requestOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getStorageUser().token}`
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(data)

        };

        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/obtenerUserAndReceta`, requestOptions).then((res) => {
            Unauthorized(res.status)
            return res.json()
        }).then((res) => {
            return res
        });

        console.log("este es mi response", response);
        return response

    } catch (error) {
        console.log("error", error);
        throw error
    }
}

export async function GetRecetasInfo({ data }) {

    try {

        const requestOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getStorageUser().token}`
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(data)

        };

        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/obtenerRecetasinfo`, requestOptions).then((res) => {
            Unauthorized(res.status)
            return res.json()
        }).then((res) => {
            return res
        });

        console.log("este es mi response", response);
        return response

    } catch (error) {
        console.log("error", error);
        throw error
    }
}

export async function GetRecetasByIdReceta({ recetaId }) {

    try {

        const requestOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getStorageUser().token}`
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(recetaId)

        };

        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/obtenerRecetaById`, requestOptions).then((res) => {
            Unauthorized(res.status)
            return res.json()
        }).then((res) => {
            return res
        });

        console.log("este es mi response", response);
        return response

    } catch (error) {
        console.log("error", error);
        throw error
    }
}

export async function desactivateRecepies({ recetaId }) {
    try {

        const requestOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getStorageUser().token}`
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(recetaId)

        };

        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/desactivarReceta`, requestOptions).then((res) => {
            Unauthorized(res.status)
            return res.json()
        }).then((res) => {
            return res
        });

        console.log("este es mi response", response);
        return response

    } catch (error) {
        console.log("error", error);
        throw error
    }
}