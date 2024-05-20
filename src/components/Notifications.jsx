import NotificationsIcon from '@mui/icons-material/Notifications';
import { Badge, Grid, IconButton, List, ListItem, Popover } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { NotificationList } from './NotificationList';

const NotificationBell = () => {

    const [anchorEl, setAnchorEl] = useState(null);
    const [notifications, setNotifications] = useState([
        { id: 1, text: 'Notificación 1' },
        { id: 2, text: 'Notificación 2' },
        { id: 3, text: 'Notificación 3' },
        { id: 3, text: 'Notificación 3' },
        { id: 3, text: 'Notificación 3' },
        { id: 3, text: 'Notificación 3' },
        { id: 3, text: 'Notificación 3' },
        { id: 3, text: 'Notificación 3' },
        { id: 3, text: 'Notificación 3' },
    ]);
    const [cantidadNotificaciones, setCantidadNotificaciones] = useState(0);

    useEffect(() => {
        var userId = null;
        if (localStorage.getItem('UserLogged')) {
            console.log(JSON.parse(localStorage.getItem('UserLogged')));
            console.log(JSON.parse(localStorage.getItem('UserLogged')).usuarioId);
            userId = JSON.parse(localStorage.getItem('UserLogged')).usuarioId;
        }

        // Establecer conexión SSE
        const eventSource = new EventSource(`http://localhost:3600/events/${userId}`);

        // Manejar eventos recibidos
        eventSource.onmessage = (event) => {
            const newNotification = JSON.parse(event.data);
            console.log(newNotification);
            //setNotifications(prevNotifications => [...prevNotifications, newNotification]);
            setCantidadNotificaciones(prevCount => prevCount + 1);
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
                <Badge badgeContent={cantidadNotificaciones} color="error">
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
                            <NotificationList />
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
