import { useState } from "react";
import { getNotifications, updateNotifications } from "../services/NotificationService";

export const useNotification = (page, limit) => {

    const [notifications, setNotifications] = useState([]);
    const [totalNoti, setTotalNoti] = useState(0);
    const [totalUnread, setTotalUnread] = useState(0);

    const ObtenerNotificaciones = async ({ idUser, page, limit }) => {

        try {
            const result = await getNotifications(idUser, page, limit);
            setNotifications(result.notifications)
            setTotalNoti(result.total)
            setTotalUnread(result.totalUnread)

        } catch (error) {
            console.log(error);
        } finally {
        }

    }

    const LeerNotificaciones = async (idNotificaciones) => {
        try {
            const result = await updateNotifications(idNotificaciones);
        } catch (error) {
            console.log(error);
        }
    }

    return { notifications, totalNoti, totalUnread, setTotalUnread, ObtenerNotificaciones, LeerNotificaciones }
}