import { Unauthorized } from "../utils/401Unauthorized";
import { getStorageUser } from "../utils/StorageUser";

export async function saveReceta({ receta }) {

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

        const response = await fetch(`http://localhost:3600/saveReceta`, requestOptions).then((res) => {
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

        const response = await fetch(`http://localhost:3600/saveUpdateRecetaReaction`, requestOptions).then((res) => {
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

export async function GetRecetasByIdUser({ idUser }) {

    try {

        const requestOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getStorageUser().token}`
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(idUser)

        };

        const response = await fetch(`http://localhost:3600/obtenerUserAndReceta`, requestOptions).then((res) => {
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

        const response = await fetch(`http://localhost:3600/obtenerRecetaById`, requestOptions).then((res) => {
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