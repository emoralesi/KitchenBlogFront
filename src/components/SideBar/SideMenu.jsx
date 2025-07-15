import { List } from "@mui/material";
import React, { useEffect, useState } from 'react';
import '../../styles/nav.css';
import { CustomizedListItem } from "./CustomizedListItem";
import menuData from '../../../menu.json';

export default function SideMenu() {

    const [dataMenu, setDataMenu] = useState(menuData.menus)

    return (
        <div style={{ height: 'calc(100vh - 100px)' }}>
            <List sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
                height: '100%',
                alignItems: 'center',
                padding: 0
            }}>
                {dataMenu.map((doc, index) => {
                    return (
                        <CustomizedListItem key={index} doc={doc} />
                    )
                })}
            </List>
        </div >
    )
}