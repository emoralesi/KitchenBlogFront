import FavoriteIcon from '@mui/icons-material/Favorite';
import { Box } from "@mui/material";
import { TypeNotification } from "../../utils/enumTypeNoti";

export const NotificationLike = ({ params }) => {
    console.log("mis params Like", params);

    const getContent = () => {
        console.log("mi action", params.action);
        if (params.action) {
            switch (params.action) {
                case TypeNotification.LikeToAnswerd:
                    return <h5>{params.user_action[0].username} ha dado like a tu respuesta "{params.comment[0].content}" al comentario "{params.parentComment.content}" de la Receta : "{params.receta[0].titulo}".</h5>;
                case TypeNotification.LikeToComment:
                    return <h5>{params.user_action[0].username} ha dado like a tu comentario "{params.comment[0].content}" de la Receta: "{params.receta[0].titulo}".</h5>;
                case TypeNotification.LikeToReceta:
                    return <h5>{params.user_action[0].username} ha dado like a tu Receta: "{params.receta[0].titulo}".</h5>
                default:
                    return <h5>Error en notificacion</h5>;
            }
        } else {
            return null
        }

    };

    return (
        <Box sx={{ width: '100%', backgroundColor: 'gray' }}>
            <div style={{ display: 'flex' }}>
                <div style={{ width: '15%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <FavoriteIcon fontSize="large" />
                </div>
                {getContent()}
            </div>
        </Box>
    )
}