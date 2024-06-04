import { Box } from "@mui/material"
import MessageIcon from '@mui/icons-material/Message';
import { getStorageUser } from "../../utils/StorageUser";

export const NotificationCTA = ({ params }) => {
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
                    params.parentComment[0].user == getStorageUser().user
                        ? <h5 style={{ width: '85%' }}>text text text text text text text</h5>
                        : <h5 style={{ width: '85%' }}>{ ` ${params.comment[0].user} ha respondido a tu comentario en el post ${params.item.PostInfo[0].title}`}</h5>
                }

            </div>
        </Box>
    )
}