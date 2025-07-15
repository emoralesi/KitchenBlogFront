import { TypeNotification } from "../../utils/enumTypeNoti";
import { NotificationCTA } from "./NotificationCTA";
import { NotificationCTR } from "./NotificationCTR";
import { NotificationLike } from "./NotificationLike";

export const NotificationList = ({ params }) => {
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

    return (<div style={{
        width: '100%',
        backgroundColor: params.readed === true ? '#f5f5f5' : '#0707937d',
        boxShadow: params.readed === true ? 'unset': '0px 10px 10px -3px rgba(0, 0, 0, 0.5)',
        border : params.readed === true ? 'unset' : 'solid 1px #00000052'
    }}>
        {componente}
    </div>);
}