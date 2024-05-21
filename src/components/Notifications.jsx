import NotificationsIcon from '@mui/icons-material/Notifications';
import { Badge, IconButton, List, ListItem, Popover } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNotification } from '../Hooks/useNotification';
import { PopUpNotification } from '../utils/PopUpNotificaiton';
import { NotificationList } from './NotificationList';

const NotificationBell = () => {

    const [anchorEl, setAnchorEl] = useState(null);
    const { notifications, ObtenerNotificaciones } = useNotification();
    const [cantidadNotificaciones, setCantidadNotificaciones] = useState(0);

    useEffect(() => {
        var userId = null;
        if (localStorage.getItem('UserLogged')) {
            console.log(JSON.parse(localStorage.getItem('UserLogged')));
            console.log(JSON.parse(localStorage.getItem('UserLogged')).usuarioId);
            userId = JSON.parse(localStorage.getItem('UserLogged')).usuarioId;
        }

        ObtenerNotificaciones({ idUser: userId })

        // Establecer conexión SSE
        const eventSource = new EventSource(`http://localhost:3600/events/${userId}`);

        // Manejar eventos recibidos
        eventSource.onmessage = (event) => {
            const newNotification = JSON.parse(event.data);
            console.log(newNotification);
            //setNotifications(prevNotifications => [...prevNotifications, newNotification]);
            setCantidadNotificaciones(prevCount => prevCount + 1);
            PopUpNotification({ params: newNotification, userId: userId })
            ObtenerNotificaciones({ idUser: userId })
        };

        return () => {
            // Cerrar conexión SSE al desmontar el componente
            eventSource.close();
        };
    }, []);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'notification-popover' : undefined;

    return (
        <div style={{ marginRight: '20px' }}>
            <IconButton onClick={handleClick} color="inherit">
                <Badge badgeContent={notifications.length} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                {/* <Grid container spacing={2}> */}
                {/* <Grid item xs={12} md={6}> */}
                <List sx={{ width: { xs: '90vw', md: '60vw', lg: '40vw' }, height: { xs: '70vh', md: '85vh', lg: '85vh' }, overflow: 'auto' }}>
                    {notifications.map(notification => (
                        <ListItem key={notification.id}>
                            <NotificationList key={notification.id + "b"} />
                        </ListItem>
                    ))}
                </List>
                {/* </Grid> */}
                {/* Otros elementos del componente */}
                {/* </Grid> */}

            </Popover>
        </div>
    );
};

export default NotificationBell;
