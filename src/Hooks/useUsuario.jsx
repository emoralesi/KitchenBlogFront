import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RegisterUsuario, getFavourites, getIdFavourites, getUsuariosToDescubrir, obtenerIdUserByUsername, saveUpdateFavourite } from "../services/UserService";

export const useUsuario = () => {

    const [usuariosAll, setUsuariosAll] = useState([]);
    const [usuariosAllDataGrid, setUsuariosAllDataGrid] = useState([]);
    const [usuariosDescubrir, setUsuariosDescubrir] = useState([]);
    const [favourites, setFavourites] = useState([])
    const [idFavourites, setIdFavourites] = useState([])

    const navigate = useNavigate();

    const handleLogOut = async () => {
        // Eliminar los datos de sesión almacenados en localStorage
        await localStorage.removeItem('UserLogged');
        // Redirigir al componente de inicio de sesión
        navigate('/login')
    };

    const getIdUserByUserName = async ({ username }) => {
        try {
            const result = await obtenerIdUserByUsername(username);
            return result.userId
        } catch (error) {
            console.log(error);
        }
    }

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

    const SaveUpdateMyFavourites = async ({ body }) => {

        try {
            const result = await saveUpdateFavourite(body);
            console.log("esto me trago result", result);
        } catch (error) {
            console.log(error);
        } finally {
        }

    }

    const ObtenerUsuariosDescubrir = async ({ body }) => {
        try {
            const result = await getUsuariosToDescubrir(body);
            console.log("mi result usuarios", result?.usuarios);
            setUsuariosDescubrir(result?.usuarios)
            return result;

        } catch (error) {
            console.log(error);
        } finally {
        }
    }

    const ObtenerFavourites = async ({ idUser }) => {
        try {
            const result = await getFavourites(idUser);
            console.log("mi result favoritos", result?.data);
            setFavourites(result?.data[0])
            return result;

        } catch (error) {
            console.log(error);
        } finally {
        }
    }

    const ObtenerIdFavourites = async ({ idUser }) => {
        try {
            const result = await getIdFavourites(idUser);
            console.log("mi result favoritos", result?.favourites);
            setIdFavourites(result?.favourites)
            return result;

        } catch (error) {
            console.log(error);
        } finally {
        }
    }

    return { RegistarUsuario, usuariosAll, setUsuariosAll, usuariosAllDataGrid, setUsuariosAllDataGrid, usuariosDescubrir, ObtenerUsuariosDescubrir, getIdUserByUserName, ObtenerFavourites, favourites, idFavourites, ObtenerIdFavourites, setIdFavourites, SaveUpdateMyFavourites }
}