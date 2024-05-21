import { enqueueSnackbar } from "notistack";
import { TypeNotification } from "./enumTypeNoti";

export const PopUpNotification = ({ params, userId }) => {

    console.log("mi params", params);
    let componente;
    switch (params.action_noti) {
        case TypeNotification.CommentToAnswerd:
            if (userId !== params.ownerComment[0].user) {
                enqueueSnackbar(`${params.newComment.user} tambien ha respondido al comentario de " ${params.ownerComment[0].user} : ${params.ownerComment[0].content} "`, { variant: 'waring' });
            } else {
                enqueueSnackbar(`${params.newComment.user} ha respondido a tu comentario ${params.ownerComment[0].content}`, { variant: 'waring' });
            }
            break;
        default:
            componente = null; // O algún componente por defecto o mensaje de error
    }
}