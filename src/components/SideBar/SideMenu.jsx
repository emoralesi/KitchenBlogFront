import { Box, List } from "@mui/material";
import React from "react";
import "../../styles/nav.css";
import { CustomizedListItem } from "./CustomizedListItem";
import menuData from "../../../menu.json";
import logo from "../../assets/kitchen_blog_logo_centered.svg";

export default function SideMenu() {
  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: { xs: "row", md: "column" },
        alignItems: "center",
        justifyContent: { xs: "space-around", md: "flex-start" },
        paddingY: { md: 2 },
        backgroundColor: "#f0f0f0",
      }}
    >
      {/* Logo en la parte superior */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          justifyContent: "center",
          padding: 2,
        }}
      >
        <img
          src={logo}
          alt="Kitchen Blog Logo"
          style={{ width: "220px", height: "100px"}}
        />
      </Box>

      <List
        sx={{
          display: "flex",
          flexDirection: { xs: "row", md: "column" },
          justifyContent: "space-around",
          alignItems: "center",
          width: "100%",
          height: "100%",
          padding: 0,
        }}
      >
        {menuData.menus.map((doc, index) => (
          <CustomizedListItem key={index} doc={doc} />
        ))}
      </List>
    </Box>
  );
}
