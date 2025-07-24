import { Badge, Button, IconButton, List, Popover } from "@mui/material";
import NotificationBell from "../Notification/Notifications";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { useState } from "react";

export const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const id = open ? "notification-popover" : undefined;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#b7d9fb",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "flex-end",
      }}
    >
      <NotificationBell />
      <div style={{ marginRight: "20px" }}>
        <IconButton
          onClick={(event) => {
            setAnchorEl(event.currentTarget);
          }}
          color="inherit"
        >
          <Badge>
            <ManageAccountsIcon  sx={{ fontSize: "1.8rem" }}/>
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
  );
};
