import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  RegisterUsuario,
  getDatosRecAndFav,
  getFavourites,
  getIdFavourites,
  getUsuariosToDescubrir,
  obtenerIdUserByUsername,
  saveUpdateFavourite,
} from "../services/UserService";

export const useUsuario = () => {
  const [usuariosAll, setUsuariosAll] = useState([]);
  const [usuariosAllDataGrid, setUsuariosAllDataGrid] = useState([]);
  const [usuariosDescubrir, setUsuariosDescubrir] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [idFavourites, setIdFavourites] = useState([]);
  const [reactionInfo, setReactionInfo] = useState(null);
  const [favouriteInfo, setFavouriteInfo] = useState(null);
  const [totalUsuariosDescubrir, setTotalUsuariosDescubrir] = useState(0);
  const [cantidadFavoritos, setCantidadFavoritos] = useState(0);

  const navigate = useNavigate();

  const handleLogOut = async () => {
    await localStorage.removeItem("UserLogged");
    navigate("/login");
  };

  const getIdUserByUserName = async ({ username }) => {
    try {
      const result = await obtenerIdUserByUsername(username);
      return result;
    } catch (error) {
      console.log(error);
    }
  };

  const RegistarUsuario = async ({ body }) => {
    try {
      const result = await RegisterUsuario(body);
      return result;
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const SaveUpdateMyFavourites = async ({ body }) => {
    try {
      const result = await saveUpdateFavourite(body);
      return result;
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const ObtenerUsuariosDescubrir = async ({ body }) => {
    try {
      console.log("mi body", body);

      const result = await getUsuariosToDescubrir(body);
      setUsuariosDescubrir(result?.usuarios);
      setTotalUsuariosDescubrir(result?.totalUsuarios);
      return result;
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const ObtenerFavourites = async ({ data }, timeup) => {
    try {
      const result = await getFavourites(data);
      setFavourites(result?.Favourites);
      setCantidadFavoritos(result?.totalFavourite);
      setReactionInfo(
        result?.Favourites?.map((recipe) => {
          return {
            idReceta: recipe._id,
            usuarios_id_reaction: recipe.reactions.map(
              (reaction) => reaction.user_id
            ),
          };
        })
      );

      setFavouriteInfo(
        result?.Favourites.map((recipe) => {
          return {
            idReceta: recipe._id,
            usuarios_id_favourite: recipe.favourite,
          };
        })
      );
      return result;
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const ObtenerDataFavAndRec = async ({ idUser }) => {
    try {
      const result = await getDatosRecAndFav(idUser);
      return result.data[0];
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const ObtenerIdFavourites = async ({ idUser }) => {
    try {
      const result = await getIdFavourites(idUser);
      setIdFavourites(result?.favourites);
      return result;
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const ObtenerDatosUsuario = async ({ idUser }) => {
    try {
      const result = await getDataUsuarios(idUser);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    RegistarUsuario,
    usuariosAll,
    setUsuariosAll,
    usuariosAllDataGrid,
    setUsuariosAllDataGrid,
    usuariosDescubrir,
    ObtenerUsuariosDescubrir,
    getIdUserByUserName,
    ObtenerFavourites,
    favourites,
    idFavourites,
    ObtenerIdFavourites,
    setIdFavourites,
    SaveUpdateMyFavourites,
    ObtenerDataFavAndRec,
    favouriteInfo,
    reactionInfo,
    setReactionInfo,
    totalUsuariosDescubrir,
    setCantidadFavoritos,
    cantidadFavoritos,
  };
};
