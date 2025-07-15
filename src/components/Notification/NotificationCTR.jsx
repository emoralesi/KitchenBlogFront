import { Box } from "@mui/material"
import MessageIcon from '@mui/icons-material/Message';

export const NotificationCTR = ({ params }) => {
    return (
        <Box sx={{ width: '100%'}}>
            <div style={{ display: 'flex' }}>
                <div style={{ width: '15%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <MessageIcon fontSize="large" />
                </div>
                <h5 style={{ width: '85%' }}>{`${params.user_action[0]?.username} ha comentado " ${params.comment[0]?.content}" a tu Receta : ${params.receta[0]?.titulo}`}</h5>
            </div>
        </Box>
    )
}