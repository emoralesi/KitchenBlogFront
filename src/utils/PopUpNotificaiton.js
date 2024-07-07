import { enqueueSnackbar } from "notistack";
import { TypeNotification } from "./enumTypeNoti";
import { getStorageUser } from "./StorageUser";

export const PopUpNotification = ({ params, userId }) => {

    console.log("mi params", params);
    console.log("entré al pop up");
    try {
        switch (params.action_noti) {
            case TypeNotification.CommentToAnswerd:
                if (params.parentComment.user._id == getStorageUser().usuarioId) {
                    enqueueSnackbar(`${params.user.username} ha respondido a tu comentario ${params.parentComment.content} de la Receta: "${params.receta.titulo}".`, { variant: 'info' });
                } else {
                    enqueueSnackbar(` ${params.user.username} también ha respondido al comentario de ${params.parentComment.user.username} : "${params.parentComment.content}" en la Receta: "${params.receta.titulo}".`, { variant: 'info' });
                }
                break;
            case TypeNotification.CommentToReceta:
                enqueueSnackbar(`${params.user.username} ha comentado " ${params.comment.content}" a tu Receta : ${params.receta.titulo}`, { variant: 'info' });
                break;
            case TypeNotification.LikeToAnswerd:
                enqueueSnackbar(`${params.user.username} ha dado like a tu respuesta "${params.comment.content}" al comentario "${params.parentComment.content}" de la Receta : "${params.receta.titulo}"`, { variant: 'info' });
                break;
            case TypeNotification.LikeToComment:
                enqueueSnackbar(`${params.user.username} ha dado like a tu comentario "${params.comment.content}" de la Receta: "${params.receta.titulo}"`, { variant: 'info' });
                break;
            case TypeNotification.LikeToReceta:
                enqueueSnackbar(`${params.user.username} ha dado like a tu Receta: "${params.receta.titulo}"`, { variant: 'info' });
                break;
            default:
                null;
        }
    } catch (error) {
        console.log(error);
    }

}