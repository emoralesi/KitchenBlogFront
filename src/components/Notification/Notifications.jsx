import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  Badge,
  IconButton,
  List,
  ListItem,
  Popover,
  Button,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNotification } from "../../Hooks/useNotification";
import { PopUpNotification } from "../../utils/PopUpNotificaiton";
import { NotificationList } from "./NotificationList";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const NotificationBell = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const {
    notifications,
    totalNoti,
    totalUnread,
    setTotalUnread,
    ObtenerNotificaciones,
    LeerNotificaciones,
  } = useNotification();
  const [limit, setLimit] = useState(9);
  const [cantidadNotificaciones, setCantidadNotificaciones] = useState(0);
  const page = 1;

  useEffect(() => {
    var userId = null;
    if (localStorage.getItem("UserLogged")) {
      userId = JSON.parse(localStorage.getItem("UserLogged")).usuarioId;
    }

    ObtenerNotificaciones({ idUser: userId, page: page, limit });

    const eventSource = new EventSource(
      `${import.meta.env.VITE_APP_API_URL}/events/${userId}`
    );
    eventSource.onmessage = (event) => {
      const newNotification = JSON.parse(event.data);
      // setCantidadNotificaciones(prevCount => prevCount + 1);
      PopUpNotification({ params: newNotification, userId });
      ObtenerNotificaciones({ idUser: userId, page: 1, limit });
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    const IdNotifications = notifications
      .filter((value) => value.readed === false)
      .map((value) => value._id);
    LeerNotificaciones(IdNotifications);
    setAnchorEl(null);

    const userId = localStorage.getItem("UserLogged")
      ? JSON.parse(localStorage.getItem("UserLogged")).usuarioId
      : null;
    setLimit(10);
    ObtenerNotificaciones({ idUser: userId, page: page, limit: 10 });
  };

  const loadMore = () => {
    setLimit((prevLimit) => prevLimit + 5);
    ObtenerNotificaciones({
      idUser: JSON.parse(localStorage.getItem("UserLogged")).usuarioId,
      page: 1,
      limit: limit + 5,
    });
  };

  const open = Boolean(anchorEl);
  const id = open ? "notification-popover" : undefined;

  return (
    <div style={{ marginRight: "20px", marginTop: "10px" }}>
      <IconButton onClick={handleClick} color="inherit">
        <Badge badgeContent={totalUnread} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: 6,
            maxWidth: "90vw",
            bgcolor: "background.paper",
          },
        }}
      >
        <Box px={2} py={1} borderBottom="1px solid #e0e0e0">
          <Typography variant="h6" fontWeight={600}>
            Notificaciones
          </Typography>
        </Box>

        {notifications.length === 0 ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="50vh"
            px={3}
            textAlign="center"
            bgcolor="background.default"
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No tienes notificaciones
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Te avisaremos cuando alguien <strong>comente</strong>, dé
              <strong> like</strong> a una de tus recetas o haya{" "}
              <strong>Respondido</strong>
              algun comentario tuyo.
            </Typography>
          </Box>
        ) : (
          <>
            <List
              sx={{
                width: { xs: "90vw", md: "60vw", lg: "40vw" },
                height: { xs: "70vh", md: "85vh", lg: "85vh" },
                overflowY: "auto",
              }}
            >
              {notifications.map((notification, index) => (
                <React.Fragment key={index}>
                  <ListItem disableGutters>
                    <NotificationList params={notification} />
                  </ListItem>
                  {index < notifications.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            {notifications.length < totalNoti && (
              <Box px={2} py={1}>
                <Button
                  onClick={loadMore}
                  fullWidth
                  variant="outlined"
                  color="primary"
                  startIcon={<ExpandMoreIcon />}
                >
                  Ver más
                </Button>
              </Box>
            )}
          </>
        )}
      </Popover>
    </div>
  );
};

export default NotificationBell;
