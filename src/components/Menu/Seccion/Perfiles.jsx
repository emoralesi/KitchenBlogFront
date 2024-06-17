import { useParams } from "react-router-dom";
import { getStorageUser } from "../../../utils/StorageUser"
import { Perfil } from "./Perfil"
import { PerfilOwner } from "./PerfilOwner"

export const Perfiles = () => {
    let { idUser } = useParams();
    return (
        getStorageUser().usuarioId == idUser ? <PerfilOwner /> : <Perfil idUser={idUser} />
    )
}