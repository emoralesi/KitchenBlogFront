import { Box } from "@mui/material"
import MessageIcon from '@mui/icons-material/Message';

export const NotificationCTA = ({ params }) => {
    return (
        <Box sx={{ width: '100%', backgroundColor: 'gray' }}>
            <div style={{ display: 'flex' }}>
                <div style={{ width: '15%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <MessageIcon fontSize="large" />
                </div>
                <h5 style={{ width: '85%' }}>text text text text text text text</h5>
            </div>
        </Box>
    )
}