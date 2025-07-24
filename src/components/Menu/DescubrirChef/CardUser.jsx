import {
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Avatar,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getCloudinaryUrl } from "../../../utils/GetCloudinaryUrl";

export const CardUser = ({ user }) => {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        maxWidth: 360,
        borderRadius: 4,
        boxShadow: 4,
        transition: "transform 0.3s",
        "&:hover": {
          transform: "scale(1.03)",
        },
      }}
    >
      <CardActionArea
        onClick={() => navigate(`/main/profile/${user.username}`)}
        sx={{ p: 2 }}
      >
        <Box display="flex" justifyContent="center" mb={2}>
          <Avatar
            src={getCloudinaryUrl(user.profileImageUrl, { width: 400 })}
            sx={{
              width: 100,
              height: 100,
              fontSize: 48,
              border: "3px solid black",
              bgcolor: "primary.main",
            }}
          >
            {user.username?.[0]?.toUpperCase()}
          </Avatar>
        </Box>

        <CardHeader
          title={
            <Typography variant="h5" align="center" fontWeight="bold">
              {user.username}
            </Typography>
          }
          sx={{ p: 0 }}
        />

        <Divider sx={{ my: 2 }} />

        <CardContent sx={{ textAlign: "center" }}>
          <Typography variant="body1" color="text.primary" gutterBottom>
            <strong>Recetas:</strong> {user.recetasCount}
          </Typography>
          <Typography variant="body1" color="text.primary">
            <strong>Likes:</strong> {user.totalReactions}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
