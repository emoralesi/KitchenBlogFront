import { useParams } from "react-router-dom";
import { getStorageUser } from "../../../utils/StorageUser"
import { Perfil } from "./Perfil"
import { PerfilOwner } from "./PerfilOwner"

export const Perfiles = () => {
    let { username } = useParams();
    return (
        (getStorageUser().username).toLowerCase() == username.toLowerCase() ? <PerfilOwner /> : <Perfil userName={username} />
    )
}