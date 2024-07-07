import { TypeNotification } from "../../utils/enumTypeNoti";
import { NotificationCTA } from "./NotificationCTA";
import { NotificationCTR } from "./NotificationCTR";
import { NotificationLike } from "./NotificationLike";

export const NotificationList = ({ params }) => {
    console.log("traiganme mis params", params.action);
    console.log(TypeNotification.LikeToReceta);
    console.log(TypeNotification.LikeToReceta == params.action);
    let componente;
    switch (params.action) {
        case TypeNotification.CommentToAnswerd:
            componente = <NotificationCTA params={params} />;
            break;
        case TypeNotification.CommentToReceta:
            componente = <NotificationCTR params={params} />;
            break;
        case TypeNotification.LikeToReceta:
        case TypeNotification.LikeToAnswerd:
        case TypeNotification.LikeToComment:
            componente = <NotificationLike params={params} />;
            break;
        default:
            componente = null; // O algún componente por defecto o mensaje de error
    }

    return (<div style={{ width: '100%' }}>
        {componente}
    </div>);
}