import { Box } from "@mui/material"
import MessageIcon from '@mui/icons-material/Message';
import { getStorageUser } from "../../utils/StorageUser";

export const NotificationCTA = ({ params }) => {
    const { user_action, parentComment, receta } = params;
    return (
        <Box sx={{ width: '100%', backgroundColor: 'gray' }}>
            {
                console.log(params)
            }
            <div style={{ display: 'flex' }}>
                <div style={{ width: '15%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <MessageIcon fontSize="large" />
                </div>
                {
                    params.parentComment[0].user == getStorageUser().usuarioId
                        ? <h5 style={{ width: '85%' }}>{`${user_action.username} ha respondido a tu comentario ${parentComment.content} de la receta : ${receta.titulo}.`}</h5>
                        : <h5 style={{ width: '85%' }}>{` ${user_action.username} también ha respondido al comentario de ${parentComment.user.username} : ${parentComment.content} en la Receta ${receta.titulo}.`}</h5>
                }
            </div>
        </Box>
    )
}