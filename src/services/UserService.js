import { Unauthorized } from "../utils/401Unauthorized";
import { getStorageUser } from "../utils/StorageUser";

export async function LoginUsuario(req) {

    try {

        let data = {
            "email": req.userEmail,
            "password": req.password
        }

        const requestOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(data)

        };

        const response = await fetch(`http://localhost:3600/login`, requestOptions).then((res) => {
            return res.json()
        }).then((res) => {
            return res
        });

        return response

    } catch (error) {
        throw error
    }
}

export async function RegisterUsuario(req) {
    try {

        console.log("my req", req);

        let data = {
            "email": req.emailUsuario,
            "password": req.password
        }
        console.log("me cai despues del data");
        const requestOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(data)

        };

        console.log("me cai despues del requestOption");

        const response = await fetch(`http://localhost:3600/registro`, requestOptions).then((res) => {
            return res.json()
        }).then((res) => {
            return res
        });

        console.log("me cai despues de la llamada");

        return response

    } catch (error) {
        console.log(error);
        throw error
    }
}

export async function getUsuariosToDescubrir(req) {
    try {

        console.log("my req", req);

        let data = {
            "userId": req.userId
        }
        console.log("me cai despues del data");
        const requestOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getStorageUser().token}`,
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(data)

        };

        console.log("me cai despues del requestOption");

        const response = await fetch(`http://localhost:3600/obtenerUsuariosDescubrir`, requestOptions).then((res) => {
            Unauthorized(res.status)
            return res.json()
        }).then((res) => {
            return res
        });

        console.log("me cai despues de la llamada");

        return response

    } catch (error) {
        console.log(error);
        throw error
    }
}

export default { LoginUsuario, RegisterUsuario, getUsuariosToDescubrir }