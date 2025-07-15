import { Unauthorized } from "../utils/401Unauthorized";
import { getStorageUser } from "../utils/StorageUser";

export async function getNotifications(idNotificated, page, limit) {

    try {

        let data = {
            "idNotificated": idNotificated,
            "page": page,
            "limit": limit
        }

        const requestOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getStorageUser().token}`
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(data)

        };

        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/obtenerNotificaciones`, requestOptions).then((res) => {
            Unauthorized(res.status)
            return res.json()
        }).then((res) => {
            return res
        });

        return response

    } catch (error) {
        console.log("error", error);
        throw error
    }
}

export async function updateNotifications(idNotifications, page, limit) {

    try {

        let data = {
            "idNotifications": idNotifications
        }

        const requestOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getStorageUser().token}`
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(data)

        };

        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/readedNotification`, requestOptions).then((res) => {
            Unauthorized(res.status)
            return res.json()
        }).then((res) => {
            return res
        });
        
        return response

    } catch (error) {
        console.log("error", error);
        throw error
    }
}