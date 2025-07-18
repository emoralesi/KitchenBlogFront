import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  Collapse,
  Container,
  Divider,
  ListItem,
  ListItemText,
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
    if (doc.submenus.length == 0) {
      if (doc.linkTo == "/main/profile/") {
        navigate(`${doc.linkTo}${getStorageUser().username}`, {
          preventScrollReset: true,
        });
      } else {
        navigate(doc.linkTo);
      }
    }
  };

  return (
    <div style={{ padding: 0, width: "100%" }}>
      <div>
        <ListItem
          button
          key={doc.id_menu}
          onClick={handleClick}
          sx={{ paddingLeft:'20px' }}
        >
          <Container
            sx={{
              display: { xs: "flex", md: "contents" },
              alignItems: { xs: "center" },
              justifyContent: { xs: "center", md: "unset" },
            }}
          >
            <Icons idMenu={doc.id_menu} />
            <ListItemText
              sx={{ paddingLeft: "7px", display: { xs: "none", md: "unset" } }}
              primary={doc.nombre_menu}
            />
            {doc.submenus.length > 0 ? (
              open ? (
                <ExpandLess />
              ) : (
                <ExpandMore />
              )
            ) : (
              <></>
            )}
          </Container>
        </ListItem>
      </div>
      {doc.submenus.length > 0 ? (
        <Collapse
          key={doc.submenus.id_sub_menu}
          in={open}
          timeout="auto"
          unmountOnExit
        >
          <ListChild doc={doc} />
        </Collapse>
      ) : (
        <></>
      )}
      <Divider />
    </div>
  );
};
