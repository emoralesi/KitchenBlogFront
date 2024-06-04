import { Unauthorized } from "../utils/401Unauthorized";
import { getStorageUser } from "../utils/StorageUser";

export async function getNotifications(idNotificated) {

    try {

        let data = {
            "idNotificated": idNotificated
        }

        console.log("mi token", getStorageUser().token);

        const requestOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getStorageUser().token}`
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(data)

        };

        const response = await fetch(`http://localhost:3600/obtenerNotificaciones`, requestOptions).then((res) => {
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