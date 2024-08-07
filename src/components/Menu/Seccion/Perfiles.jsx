import { useParams } from "react-router-dom";
import { getStorageUser } from "../../../utils/StorageUser"
import { Perfil } from "./Perfil"
import { PerfilOwner } from "./PerfilOwner"
import { useState } from "react";
import { Favourites } from "./MyFavourites";
import { Switch } from "@mui/material";
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

export const Perfiles = () => {
    let { username } = useParams();

    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <div style={{ height: '40%' }}>
                <h1>My perfil</h1>
            </div>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example"
                        sx={{
                            backgroundColor: 'background.paper',
                            '& .MuiTabs-flexContainer': {
                                display: 'flex', justifyContent: 'space-evenly',
                            },
                        }}
                    >
                        <Tab label="Post" {...a11yProps(0)} />
                        <Tab label="Favourites" {...a11yProps(1)} />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                    {(getStorageUser().username).toLowerCase() == username.toLowerCase() ? <PerfilOwner /> : <Perfil userName={username} />}
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <Favourites userName={username} />
                </CustomTabPanel>
            </Box>
            {/* <div>
                {
                    isPosting ?
                        (getStorageUser().username).toLowerCase() == username.toLowerCase() ? <PerfilOwner /> : <Perfil userName={username} />
                        : <Favourites />
                }

            </div> */}
        </div>
    )
}

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}