import { Unauthorized } from "../utils/401Unauthorized";
import { getStorageUser } from "../utils/StorageUser";

export async function saveComment({ comment }) {

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

        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/saveComentario`, requestOptions).then((res) => {
            Unauthorized(res.status)
            return res.json()
        }).then((res) => {
            return res
        });
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
        const requestOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getStorageUser().token}`,
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(data)

        };

        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/saveUpdateCommentReaction`, requestOptions).then((res) => {
            Unauthorized(res.status)
            return res.json()
        }).then((res) => {
            return res
        });

        return response

    } catch (error) {
        console.log(error);
        throw error
    }
}