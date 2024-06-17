import { Box, Card, CardActionArea, CardContent, CardMedia, Typography } from "@mui/material"
import { useEffect } from "react"
import { useUsuario } from "../../../Hooks/useUsuario"
import { getStorageUser } from "../../../utils/StorageUser";
import { CardUSer } from "./CardUser";

export const DescubrirChefs = () => {
    const { ObtenerUsuariosDescubrir, usuariosDescubrir } = useUsuario();
    useEffect(() => {
        ObtenerUsuariosDescubrir({ body: { userId: getStorageUser().usuarioId } })
    }, [])
    return (
        <Box p={2} sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", columnGap: '15px', rowGap: '15px' }}>
            {usuariosDescubrir.map((values) => (
                <CardUSer user={values} />
            ))}
        </Box>
    )
}