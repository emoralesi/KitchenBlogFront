import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import '../styles/container.css'

export default function MainContent() {
    return (
        <div className="container">

            <header className='headerImg'>
                <img style={{ height: '100%', width: '100%' }} />
            </header>

            <header className='header'>
                <Header />
            </header>

            <nav className='nav'>
                <div style={{ width: '100%', height: '100%', backgroundColor: 'black' }}></div>
            </nav>

            <main className='main'>
                <Box p={2} border="1px solid #ccc" sx={{ width: 'auto', height: 'auto' }}>
                    <Outlet />
                </Box>
            </main>

        </div>
    )
}