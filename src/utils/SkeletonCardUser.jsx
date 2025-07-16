import {
  Card,
  CardContent,
  CardHeader,
  Skeleton,
  Avatar,
  Box,
  Divider,
} from "@mui/material";

export const CardUserSkeleton = () => {
  return (
    <Card
      sx={{
        maxWidth: 360,
        borderRadius: 4,
        boxShadow: 4,
      }}
    >
      <Box display="flex" justifyContent="center" mt={2} mb={2}>
        <Skeleton
          variant="circular"
          width={100}
          height={100}
          animation="wave"
        />
      </Box>

      <CardHeader
        title={
          <Skeleton
            variant="text"
            width="60%"
            height={32}
            animation="wave"
            sx={{ mx: "auto" }}
          />
        }
        sx={{ p: 0 }}
      />

      <Divider sx={{ my: 2 }} />

      <CardContent sx={{ textAlign: "center" }}>
        <Skeleton
          variant="text"
          width="80%"
          height={24}
          animation="wave"
          sx={{ mx: "auto", mb: 1 }}
        />
        <Skeleton
          variant="text"
          width="80%"
          height={24}
          animation="wave"
          sx={{ mx: "auto" }}
        />
      </CardContent>
    </Card>
  );
};
