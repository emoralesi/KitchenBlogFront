import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material"
import { Link } from "react-router-dom"
import { Icons } from "./iconsSideBar"

export const ListChild = ({ doc }) => {
    return (
        <div className='listchild'>
            <List component='li' disablePadding key={doc.nombre_menu.id_producto}>
                {doc.submenus.map(subMenus => {
                    return (
                        <Link to={subMenus.linkTo} style={{ textDecoration: 'none' }} key={subMenus.id_sub_menu}>
                            <ListItem button key={subMenus.id_sub_menu}>
                                <ListItemIcon>
                                    <Icons idSubMenu={subMenus.id_sub_menu} />
                                </ListItemIcon>
                                <ListItemText sx={{ color: 'black', display: { xs: 'none', md: 'unset' } }} key={subMenus.id_sub_menu} primary={subMenus.nombre_sub_menu} />
                            </ListItem>
                        </Link>
                    )
                })}
            </List>
        </div>
    )
}