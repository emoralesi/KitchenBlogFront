import { Box, Grid, Container, Paper, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";
import { Header } from "../Menu/Header";
import SideMenu from '../SideBar/SideMenu'
import '../../styles/container.css'

export default function MainContent() {
    return (
        <Container sx={{ height: '100vh', padding: '0 !important', margin: '0 !important', width: '100vw', maxWidth: '100vw !important' }}>
            <Grid container >
                {/* Row 1: Header */}
                <Grid item xs={2}> {/* Adjust xs to 2 for headerImg */}
                    <Paper elevation={3} sx={{ height: '70px', backgroundColor: 'ghostwhite' }}>
                        {/* Header Image or Content */}
                    </Paper>
                </Grid>
                <Grid item xs={10}>  {/* Adjust xs to 10 for all headers */}
                    <Header />
                </Grid>

                {/* Row 2: Navigation and Main Content */}
                <Grid item xs={2}>  {/* Adjust xs to 2 for nav */}
                    <Paper elevation={3} sx={{ height: 'calc(100vh - 70px)', backgroundColor: 'cornsilk' }}>
                        <SideMenu />
                    </Paper>
                </Grid>
                <Grid item xs={10}>  {/* Adjust xs to 10 for all main content */}
                    <Paper elevation={3} sx={{ height: 'calc(100vh - 70px)', backgroundColor: '#D8D9DA', overflow: 'auto' }}>
                        <Box p={2} flexGrow={1}>
                            <Outlet />
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

        </Container>
    );
}