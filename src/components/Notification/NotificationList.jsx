import { TypeNotification } from "../../utils/enumTypeNoti";
import { NotificationCTA } from "./NotificationCTA";
import { NotificationCTP } from "./NotificationCTP";

export const NotificationList = ({ params }) => {
    let componente;
    switch (params.action) {
        case TypeNotification.CommentToAnswerd:
            componente = <NotificationCTA params={params} />;
            break;
        case TypeNotification.CommentToReceta:
            componente = <NotificationCTP params={params} />;
            break;
        case TypeNotification.LikeToAnswerd || TypeNotification.LikeToComment || TypeNotification.LikeToReceta:
            componente = <Componente3 />;
            break;
        default:
            componente = null; // O algún componente por defecto o mensaje de error
    }

    return (<div style={{ width: '100%' }}>
        {componente}
    </div>);
}