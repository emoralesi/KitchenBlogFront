import { Box } from "@mui/material"
import MessageIcon from '@mui/icons-material/Message';

export const NotificationCTP = ({ params }) => {
    return (
        <Box sx={{ width: '100%', backgroundColor: 'gray' }}>
            {
                console.log(params)
            }
            <div style={{ display: 'flex' }}>
                <div style={{ width: '15%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <MessageIcon fontSize="large" />
                </div>
                <h5 style={{ width: '85%' }}>{`${params.user_action} ha comentado " ${params.comment[0].content}" a tu Receta : ${params.item.RecetaInfo[0].title}`}</h5>

            </div>
        </Box>
    )
}