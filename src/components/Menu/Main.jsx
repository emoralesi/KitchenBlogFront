import { Box, Grid, Container, Paper } from "@mui/material";
import { Outlet } from "react-router-dom";
import { Header } from "../Menu/Header";
import SideMenu from "../SideBar/SideMenu";
import "../../styles/container.css";

export default function MainContent() {
  return (
    <Box sx={{ display: "flex" }}>
      <Paper
        elevation={3}
        sx={{
          width: "16.66%",
          height: "100vh",
          backgroundColor: "cornsilk",
          borderRadius: "unset",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 1200,
        }}
      >
        <SideMenu />
      </Paper>

      <Box sx={{ marginLeft: "16.66%", width: "83.34%" }}>
        <Box>
          <Header />
        </Box>
        <Box>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
