import { Badge, Box, Button, IconButton, List, Popover } from "@mui/material";
import NotificationBell from "../Notification/Notifications";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/kitchen_blog_logo_centered.svg";

export const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const id = open ? "notification-popover" : undefined;

  const navigate = useNavigate();

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#b7d9fb",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div>
      <Box sx={{ display: {sx: "flex", md: "none"}, alignItems: "center" }}>
        <img
          src={logo}
          alt="Kitchen Blog Logo"
          style={{ height: "80px", width: "150px" }}
        />
      </Box>
      </div>

      <div style={{display:'flex', alignItems:'flex-end'}}>
        <NotificationBell />
        <div style={{ marginRight: "20px" }}>
          <IconButton
            onClick={(event) => {
              setAnchorEl(event.currentTarget);
            }}
            color="inherit"
          >
            <Badge>
              <ManageAccountsIcon sx={{ fontSize: "1.8rem" }} />
            </Badge>
          </IconButton>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={() => {
              setAnchorEl(null);
            }}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <Button
              onClick={() => {
                setAnchorEl(null);
                localStorage.clear();
                window.location.href = "/login";
              }}
            >
              Log Out
            </Button>
          </Popover>
        </div>
      </div>
    </div>
  );
};
