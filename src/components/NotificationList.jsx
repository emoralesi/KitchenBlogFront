import { TypeNotification } from "../utils/enumTypeNoti";
import { NotificationCTA } from "./NotificationCTA";
import { NotificationCTP } from "./NotificationCTP";

export const NotificationList = ({ params }) => {
    let componente;
    switch (TypeNotification.CommentToAnswerd) {
        case TypeNotification.CommentToAnswerd:
            componente = <NotificationCTA />;
            break;
        case TypeNotification.CommentToPost:
            componente = <NotificationCTP />;
            break;
        case TypeNotification.LikeToAnswerd || TypeNotification.LikeToComment || TypeNotification.LikeToPost:
            componente = <Componente3 />;
            break;
        default:
            componente = null; // O algún componente por defecto o mensaje de error
    }

    return (<div style={{ width: '100%' }}>
        {componente}
    </div>);
}