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
        <Box p={2} sx={{
            display: "grid",
            gap: "15px",
            gridTemplateColumns: {
              xs: "1fr", // mobile: 1 item por fila
              sm: "repeat(2, 1fr)", // pantallas medianas: 2 items por fila
              md: "repeat(3, 1fr)", // pantallas grandes: 3 items por fila
            },
          }}>
            {usuariosDescubrir.map((values) => (
                <CardUSer user={values} />
            ))}
        </Box>
    )
}