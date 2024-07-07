import { Unauthorized } from "../utils/401Unauthorized";
import { getStorageUser } from "../utils/StorageUser";

export async function saveComment({ comment }) {

    console.log("mi data", comment);

    try {

        const requestOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getStorageUser().token}`
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(comment)

        };

        const response = await fetch(`http://localhost:3600/saveComentario`, requestOptions).then((res) => {
            Unauthorized(res.status)
            return res.json()
        }).then((res) => {
            return res
        });

        console.log("este es mi response", response);
        return response

    } catch (error) {
        console.log("error", error);
        throw error
    }
}

export async function saveUpdateReactionComment(req) {
    try {

        let data = {
            "idComment": req.idComment,
            "idUser": req.idUser,
            "estado": req.estado,
            "type": req.type,
            "idReceta": req.idReceta,
            "parentComment": req.parentComment
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

        const response = await fetch(`http://localhost:3600/saveUpdateCommentReaction`, requestOptions).then((res) => {
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