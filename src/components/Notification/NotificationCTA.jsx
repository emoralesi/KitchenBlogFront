import { Box } from "@mui/material"
import MessageIcon from '@mui/icons-material/Message';
import { getStorageUser } from "../../utils/StorageUser";

export const NotificationCTA = ({ params }) => {
    console.log("mis params", params);
    return (
        <Box sx={{ width: '100%' }}>
            {
                console.log(params)
            }
            <div style={{ display: 'flex' }}>
                <div style={{ width: '15%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <MessageIcon fontSize="large" />
                </div>
                {
                    params.parentComment.user._id == getStorageUser().usuarioId
                        ? <h5 style={{ width: '85%' }}>{`${params.user_action[0]?.username} ha respondido a tu comentario ${params.parentComment?.content} de la Receta: "${params.receta[0]?.titulo}".`}</h5>
                        : <h5 style={{ width: '85%' }}>{` ${params.user_action[0]?.username} también ha respondido al comentario de ${params.parentComment?.user[0]?.username} : "${params.parentComment?.content}" en la Receta: "${params.receta[0]?.titulo}".`}</h5>
                }
            </div>
        </Box>
    )
}