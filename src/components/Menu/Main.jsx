import { Box, Paper } from "@mui/material";
import { Outlet } from "react-router-dom";
import { Header } from "../Menu/Header";
import SideMenu from "../SideBar/SideMenu";
import "../../styles/container.css";

export default function MainContent() {
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Paper
        elevation={3}
        sx={{
          width: "16.66%",
          height: "100vh",
          borderRadius: 0,
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 1200,
        }}
      >
        <SideMenu />
      </Paper>

      <Box
        sx={{
          marginLeft: "16.66%",
          width: "83.34%",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        <Box>
          <Header />
        </Box>
        <Box sx={{ flex: 1, overflowY: "auto" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
