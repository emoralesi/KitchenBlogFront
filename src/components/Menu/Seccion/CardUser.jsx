import { Card, CardActionArea, CardContent, CardMedia, Typography } from "@mui/material"
import { useNavigate } from "react-router-dom";

export const CardUSer = ({ user }) => {
    const navigate = useNavigate();
    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardActionArea onClick={() => {
                navigate(`/main/profile/${user.username}`)
            }}>
                <CardMedia
                    component="img"
                    height="140"
                    image="/static/images/cards/contemplative-reptile.jpg"
                    alt="green iguana"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {user.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        description
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        quantity recetas : {user.recetaCount}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}