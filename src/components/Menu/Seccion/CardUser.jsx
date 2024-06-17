import { Card, CardActionArea, CardContent, CardMedia, Typography } from "@mui/material"

export const CardUSer = ({ user }) => {
    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardActionArea onClick={() => {

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
                        quantity posts : {user.postCount}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}