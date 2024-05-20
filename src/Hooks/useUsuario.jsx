import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RegisterUsuario } from "../services/UserService";

export const useUsuario = () => {

    const [usuariosAll, setUsuariosAll] = useState([]);
    const [usuariosAllDataGrid, setUsuariosAllDataGrid] = useState([]);

    const navigate = useNavigate();

    const handleLogOut = async () => {
        // Eliminar los datos de sesión almacenados en localStorage
        await localStorage.removeItem('UserLogged');
        // Redirigir al componente de inicio de sesión
        navigate('/login')
    };

    const RegistarUsuario = async ({ body }) => {

        try {
            const result = await RegisterUsuario(body);
            console.log("esto me trago result", result);
            return result;

        } catch (error) {
            console.log(error);
        } finally {
        }

    }

    return { RegistarUsuario, obtenerUsuarios, usuariosAll, setUsuariosAll, actualizarUsuarioEstado, usuariosAllDataGrid, setUsuariosAllDataGrid }
}