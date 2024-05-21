import { useState } from "react";
import { getNotifications } from "../services/NotificationService";

export const useNotification = () => {

    const [notifications, setNotifications] = useState([]);
    
    const ObtenerNotificaciones = async ({ idUser }) => {

        try {
            const result = await getNotifications(idUser);
            setNotifications(result.notifications)

        } catch (error) {
            console.log(error);
        } finally {
        }

    }

    return { notifications, ObtenerNotificaciones }
}