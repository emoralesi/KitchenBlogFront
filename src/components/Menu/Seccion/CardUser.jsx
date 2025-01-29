import { Avatar, Card, CardActionArea, CardContent, CardMedia, Typography } from "@mui/material"
import { useNavigate } from "react-router-dom";

export const CardUSer = ({ user }) => {
    const navigate = useNavigate();
    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardActionArea onClick={() => {
                navigate(`/main/profile/${user.username}`)
            }}>
                <div style={{ marginTop: '10px', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Avatar
                        sx={{
                            width: 100,
                            height: 100,
                            fontSize: 80,
                            borderColor: 'black',
                            border: 'solid'
                        }}
                        src={user.profileImageUrl}
                    >
                        {user.username?.substring(0, 1).toUpperCase()}
                    </Avatar>
                </div>
                <CardContent>
                    <Typography gutterBottom variant="h4" component="div">
                        {user.username}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        quantity recetas : {user.recetasCount}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        quantity Likes : {user.totalReactions}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}