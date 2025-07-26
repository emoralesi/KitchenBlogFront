import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  Collapse,
  Divider,
  ListItem,
  ListItemText,
  Box,
  Tooltip,
} from "@mui/material";
import { useState } from "react";
import { ListChild } from "./ListChild";
import { Icons } from "./iconsSideBar";
import { useNavigate } from "react-router-dom";
import { getStorageUser } from "../../utils/StorageUser";

export const CustomizedListItem = ({ doc }) => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const handleClick = () => {
    setOpen(!open);
    if (doc.submenus.length === 0) {
      if (doc.linkTo === "/main/profile/") {
        navigate(`${doc.linkTo}${getStorageUser().username}`, {
          preventScrollReset: true,
        });
      } else {
        navigate(doc.linkTo);
      }
    }
  };

  return (
    <Box sx={{ width: "100%", flex: 1 }}>
      <ListItem
        button
        key={doc.id_menu}
        onClick={handleClick}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: { xs: "center", md: "flex-start" },
          px: { xs: 1, md: 2 },
          py: { xs: 0.5, md: 1 },
          width: "100%",
        }}
      >
        {/* Icono */}
        <Box sx={{ minWidth: "24px", display: "flex", justifyContent: "center" }}>
          <Icons idMenu={doc.id_menu} />
        </Box>

        {/* Texto solo en md+ */}
        <Tooltip title={doc.nombre_menu} placement="right">
          <ListItemText
            primary={doc.nombre_menu}
            sx={{
              display: { xs: "none", md: "block" },
              pl: 1,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              flexGrow: 1,
            }}
          />
        </Tooltip>

        {/* Expand icon */}
        {doc.submenus.length > 0 && (
          <Box sx={{ display: { xs: "none", md: "flex" }, ml: "auto" }}>
            {open ? <ExpandLess /> : <ExpandMore />}
          </Box>
        )}
      </ListItem>

      {/* Submenús */}
      {doc.submenus.length > 0 && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <ListChild doc={doc} />
          </Box>
        </Collapse>
      )}

      <Divider sx={{ display: { xs: "none", md: "block" } }} />
    </Box>
  );
};
