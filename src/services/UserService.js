import { Try } from "@mui/icons-material";
import { Unauthorized } from "../utils/401Unauthorized";
import { getStorageUser } from "../utils/StorageUser";

export async function LoginUsuario(req) {
  try {
    let data = {
      email: req.userEmail,
      password: req.password,
    };

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL}/login`,
      requestOptions
    )
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        return res;
      });

    return response;
  } catch (error) {
    throw error;
  }
}

export async function RegisterUsuario(req) {
  try {
    let data = {
      email: req.email,
      username: req.username,
      password: req.password,
    };
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL}/registro`,
      requestOptions
    )
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        return res;
      });

    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function obtenerIdUserByUsername(req) {
  try {
    let data = {
      username: req,
    };
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getStorageUser().token}`,
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL}/obtenerIdUsuarioByUserName`,
      requestOptions
    )
      .then((res) => {
        Unauthorized(res.status);
        return res.json();
      })
      .then((res) => {
        return res;
      });

    return response;
  } catch (error) {}
}

export async function getUsuariosToDescubrir(req) {
  try {
    let data = {
      userId: req.userId,
      username: req.username,
      orderBy: req.orderBy,
      page: req.page,
      limit: req.limit,
    };
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getStorageUser().token}`,
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL}/obtenerUsuariosDescubrir`,
      requestOptions
    )
      .then((res) => {
        Unauthorized(res.status);
        return res.json();
      })
      .then((res) => {
        return res;
      });

    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getFavourites({ data }) {
  try {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getStorageUser().token}`,
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL}/obtenerFavourite`,
      requestOptions
    )
      .then((res) => {
        Unauthorized(res.status);
        return res.json();
      })
      .then((res) => {
        return res;
      });

    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getDatosRecAndFav(req) {
  try {
    let data = {
      idUser: req,
    };

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getStorageUser().token}`,
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL}/obtenerDataUsuario`,
      requestOptions
    )
      .then((res) => {
        Unauthorized(res.status);
        return res.json();
      })
      .then((res) => {
        return res;
      });

    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getIdFavourites(req) {
  try {
    let data = {
      idUser: req,
    };
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getStorageUser().token}`,
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL}/obtenerIdFavourites`,
      requestOptions
    )
      .then((res) => {
        Unauthorized(res.status);
        return res.json();
      })
      .then((res) => {
        return res;
      });

    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function saveUpdateFavourite(req) {
  try {
    let data = {
      idUser: req.idUser,
      idReceta: req.idReceta,
      estado: req.estado,
    };
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getStorageUser().token}`,
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL}/saveUpdateFavourite`,
      requestOptions
    )
      .then((res) => {
        Unauthorized(res.status);
        return res.json();
      })
      .then((res) => {
        return res;
      });

    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export default {
  LoginUsuario,
  RegisterUsuario,
  getUsuariosToDescubrir,
  getIdFavourites,
  saveUpdateFavourite,
};
