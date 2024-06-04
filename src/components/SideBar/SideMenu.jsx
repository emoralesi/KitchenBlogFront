import { List } from "@mui/material";
import React, { useEffect, useState } from 'react';
import '../../styles/nav.css';
import { CustomizedListItem } from "./CustomizedListItem";
import menuData from '../../../menu.json';

export default function SideMenu() {

    const [dataMenu, setDataMenu] = useState(menuData.menus)

    useEffect(() => {
        console.log("ME renderice");
    }, [])

    return (
        <div>
            {
                console.log("mi datamenu", dataMenu)
            }
            <List component='nav' aria-labelledby='nested-list-subheader'>
                {dataMenu.map((doc, index) => {
                    return (
                        <CustomizedListItem key={index} doc={doc} />
                    )
                })}
            </List>
        </div>
    )
}