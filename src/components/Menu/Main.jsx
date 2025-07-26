import { Box, Paper } from "@mui/material";
import { Outlet } from "react-router-dom";
import { Header } from "../Header/Header";
import SideMenu from "../SideBar/SideMenu";
import "../../styles/container.css";

export default function MainContent() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        height: "100vh",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: { xs: "100%", md: "20%" },
          height: { xs: "80px", md: "100vh" },
          position: "fixed",
          bottom: { xs: 0, md: "auto" },
          top: { xs: "auto", md: 0 },
          left: 0,
          zIndex: 1200,
          borderRadius: 0,
        }}
      >
        <SideMenu />
      </Paper>

      <Box
        sx={{
          marginLeft: { xs: 0, md: "20%" },
          marginBottom: { xs: "80px", md: 0 },
          width: { xs: "100%", md: "80%" },
          display: "flex",
          flexDirection: "column",
          height: { xs: "calc(100vh - 80px)", md: "100vh" },
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
